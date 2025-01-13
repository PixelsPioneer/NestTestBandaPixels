export interface ScrapedProduct {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  specifications: string;
  type: string;
  profileImage: string | null;
  source: string;
  newPrice?: number;
}
