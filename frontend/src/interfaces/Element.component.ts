export interface Element {
  id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  price: number;
  newPrice: number | null;
  profileImage: string;
  link: string;
  source: string;
  specification: string;
  type: string;
  hasDiscount: boolean;
}
