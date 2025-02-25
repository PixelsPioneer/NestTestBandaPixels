import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCartParams } from './model/updateCartParams.model';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  async getUserCart(userId: number) {
    const cart = await this.prisma.cart.findMany({
      where: { user_id: userId }, // Using snake_case for database field
      include: { product: true },
    });

    this.logger.debug(`Cart for user ${userId}: ${JSON.stringify(cart)}`);
    return cart;
  }

  async updateCart({ userId, cartItems }: UpdateCartParams) {
    this.logger.log(`Deleting cart items for userId=${userId}`);

    await this.prisma.cart.deleteMany({ where: { user_id: userId } });

    const remainingItems = await this.prisma.cart.findMany({
      where: { user_id: userId },
    });
    this.logger.debug(
      `Cart after deleteMany: ${JSON.stringify(remainingItems)}`,
    );

    if (!cartItems.length) {
      this.logger.log('Cart is now empty in the database.');
      return;
    }

    this.logger.log('Adding new items to cart...');
    await this.prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        this.logger.debug(
          `Adding item: product_id=${item.id}, quantity=${item.quantity}`,
        );
        await tx.cart.create({
          data: {
            product_id: item.id,
            quantity: item.quantity,
            user_id: userId,
          },
        });
      }
    });

    this.logger.log(`Successfully updated cart for userId=${userId}`);
  }
}
