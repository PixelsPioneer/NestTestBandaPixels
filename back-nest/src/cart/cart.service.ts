import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCartParams } from './model/updateCartParams.model';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async getUserCart(userId: number) {
    const cachedCart = await this.redisService.getCart(userId);

    if (
      cachedCart &&
      cachedCart.items &&
      Array.isArray(cachedCart.items) &&
      cachedCart.items.length > 0
    ) {
      this.logger.debug(`Cache hit for user ${userId}`);
      return cachedCart;
    }

    this.logger.debug(`Cache miss for user ${userId}, fetching from DB...`);
    const cart = await this.prisma.cart.findMany({
      where: { user_id: userId },
      include: { product: true },
    });

    if (!cart || !Array.isArray(cart)) {
      this.logger.error(`Cart query returned invalid data for user ${userId}`);
      return { items: [] };
    }

    await this.redisService.setCart(userId, { items: cart });

    return { items: cart };
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
      await this.redisService.clearCart(userId);
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

    const updateCart = await this.prisma.cart.findMany({
      where: { user_id: userId },
      include: { product: true },
    });

    await this.redisService.setCart(userId, { items: updateCart });
  }
}
