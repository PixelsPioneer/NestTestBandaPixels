import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AuthGuard } from '../authentication/auth.guard';
import { User } from '../decorators/user.decorator';
import { UserDto } from '../dto/user.dto';
import { UpdateCartDto } from '../dto/updateCart.dto';

@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserCart(@User() user: UserDto) {
    return this.cartService.getUserCart(user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateCart(
    @User() user,
    @Body(new ValidationPipe()) body: UpdateCartDto,
  ) {
    this.logger.debug(
      `Received validated request body: ${JSON.stringify(body)}`,
    );

    const userId = user.sub;

    await this.cartService.updateCart({
      user_id: userId,
      cartItems: body.cartItems,
    });

    return { message: 'Cart updated successfully' };
  }
}
