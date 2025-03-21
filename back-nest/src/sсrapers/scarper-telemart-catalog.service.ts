import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { ScrapedCategory, Subcategory } from './models/catalog.models';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapedCategoryDto } from '../dto/catalogCategories.dto';

@Injectable()
export class ScraperCatalogService {
  private readonly logger = new Logger(ScraperCatalogService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async scrapeCategories(): Promise<ScrapedCategory[]> {
    const url = 'https://telemart.ua/ua/';
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const categories = await page.evaluate(() => {
      const categoryElements = Array.from(
        document.querySelectorAll('.nav-link'),
      );
      const uniqueCategories = new Map<
        string,
        { id: string; name: string; subcategories: Subcategory[] }
      >();

      categoryElements.forEach((button) => {
        const id = button.id || 'no-id';
        const name =
          button.querySelector('.nav-link__text')?.textContent?.trim() ||
          'No name';
        const categoryId = id.replace('-tab', '-0');

        if (!uniqueCategories.has(id)) {
          uniqueCategories.set(id, { id, name, subcategories: [] });
        }

        const parentCategory = uniqueCategories.get(id);
        if (parentCategory) {
          const uniqueSubcategories = new Map<string, Subcategory>();

          const subcategoryElements = Array.from(
            document.querySelectorAll(
              `#${categoryId}.tab-pane .catalog-box__item-title-link`,
            ),
          );

          subcategoryElements.forEach((sub) => {
            const subName = sub.textContent?.trim() || 'No name';
            const subContainer = sub.closest('.catalog-box__item');

            if (!subContainer || uniqueSubcategories.has(subName)) return;

            const sectionElements = Array.from(
              subContainer.querySelectorAll('.catalog-box__item-list li a'),
            );

            const sections = sectionElements.map((section) => ({
              name: section.textContent?.trim() || 'No name',
              url: section.getAttribute('href') || '#',
            }));

            uniqueSubcategories.set(subName, { name: subName, sections });
          });

          parentCategory.subcategories.push(...uniqueSubcategories.values());
        }
      });

      return Array.from(uniqueCategories.values());
    });

    await browser.close();
    this.logger.log(
      `Found ${categories.length} unique categories with subcategories and sections.`,
    );

    return categories;
  }

  async scrapeAndSaveCategories(): Promise<ScrapedCategoryDto[]> {
    this.logger.log('Start to get catalog service...');
    const scrapedCatalog = await this.scrapeCategories();

    if (!scrapedCatalog || scrapedCatalog.length === 0) {
      this.logger.warn('No categories found in scraped catalog from Telemart.');
      return [];
    }

    try {
      for (const category of scrapedCatalog) {
        const { id: scrapedId, name, subcategories } = category;

        const savedCategory = await this.prismaService.scrapedCategory.upsert({
          where: { catalogId: scrapedId },
          update: { name },
          create: {
            catalogId: scrapedId,
            name,
            subcategories: {
              create: subcategories.map((sub) => ({
                name: sub.name,
                sections: {
                  create: sub.sections.map((section) => ({
                    name: section.name,
                    url: section.url,
                  })),
                },
              })),
            },
          },
        });

        this.logger.log(
          `Category ${name} saved to DB with ID ${savedCategory.id}.`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to save categories to DB', error);
    }

    this.logger.log(
      `Scraped ${scrapedCatalog.length} categories from Telemart.`,
    );

    return scrapedCatalog.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: category.subcategories.map((sub) => ({
        name: sub.name,
        sections: sub.sections.map((section) => ({
          name: section.name,
          url: section.url,
        })),
      })),
    }));
  }
}
