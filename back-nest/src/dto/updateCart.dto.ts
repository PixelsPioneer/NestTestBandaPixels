import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @ApiProperty({ type: [CartItemDto] })
  cartItems: CartItemDto[];
}
