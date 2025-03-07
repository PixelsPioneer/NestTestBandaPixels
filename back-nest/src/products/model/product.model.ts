import { Prisma } from '@prisma/client';

export interface ProductModel {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  price: number;
  newPrice?: number | null;
  specifications: string;
  type: string;
  profileImages: Prisma.JsonValue;
  source: string;
  hasDiscount: boolean;
  rating?: number | null;
}
