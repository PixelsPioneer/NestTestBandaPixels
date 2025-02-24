import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;
}

export class UpdateCartDto {
  @IsArray()
  @ApiProperty()
  cartItems: CartItemDto[];
}
