import { ScrapedCategoryDto } from '../../dto/catalogCategories.dto';

export interface ScraperService {
  scrapeAndSaveCategories?: () => Promise<ScrapedCategoryDto[]>;
  scrapeAndSaveTelemartProducts?: () => Promise<void>;
  scrapeAndSaveRozetkaProducts?: () => Promise<void>;
}
