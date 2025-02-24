import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCartParams } from './model/updateCartParams.model';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  async getUserCart(user_id: number) {
    if (!user_id) {
      throw new UnauthorizedException('Unauthorized');
    }

    this.logger.log(`Fetching cart for user: ${user_id}`);

    const cart = await this.prisma.cart.findMany({
      where: { user_id },
      include: { product: true },
    });

    this.logger.debug(`Cart for user ${user_id}: ${JSON.stringify(cart)}`);
    return cart;
  }

  async updateCart({ user_id, cartItems }: UpdateCartParams) {
    this.logger.log(`Deleting cart items for user_id=${user_id}`);

    await this.prisma.cart.deleteMany({ where: { user_id } });

    const remainingItems = await this.prisma.cart.findMany({
      where: { user_id },
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
            user_id,
          },
        });
      }
    });

    this.logger.log(`Successfully updated cart for user_id=${user_id}`);
  }
}
