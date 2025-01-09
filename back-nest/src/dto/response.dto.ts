import { IsString, IsNumber } from 'class-validator';

export class ResponseDto {
  @IsString()
  message: string;

  @IsNumber()
  totalProducts: number;
}
