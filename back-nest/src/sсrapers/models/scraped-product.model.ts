export interface ScrapedProduct {
  title: string;
  subtitle: string | null;
  description: string;
  price: number;
  specifications: string;
  type: string;
  profileImages: string[];
  source: string;
  newPrice: number | null;
  hasDiscount: boolean;
  rating: number | null;
}
