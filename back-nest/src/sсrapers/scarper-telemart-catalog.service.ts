import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { ScrapedCategory, Subcategory } from './models/catalog.models';
import { PrismaService } from '../../prisma/prisma.service';

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
}
