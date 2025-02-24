import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsNumber()
  sub: number;

  @ApiProperty()
  @IsString()
  role: string;
}
