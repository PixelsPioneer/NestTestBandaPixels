export interface Element {
  product_id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  price: number;
  newPrice: number | null;
  profileImages: string[];
  link: string;
  source: string;
  specifications: string;
  type: string;
  hasDiscount: boolean;
  rating: number | null;
}
