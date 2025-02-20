import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AuthGuard } from '../authentication/auth.guard';

@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserCart(@Req() req) {
    const userId = req.user.sub;
    return this.cartService.getUserCart(userId);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateCart(
    @Req() req,
    @Body() body: { cartItems: { id: number; quantity: number }[] },
  ) {
    this.logger.debug(`Received request body: ${JSON.stringify(body)}`);

    if (!Array.isArray(body.cartItems)) {
      this.logger.error('cartItems is not an array!');
      return { message: 'Invalid cartItems format' };
    }

    const userId = req.user.sub;

    await this.cartService.updateCart(userId, body.cartItems);

    return { message: 'Cart updated successfully' };
  }
}
