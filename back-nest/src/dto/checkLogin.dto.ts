import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login: string;
}
