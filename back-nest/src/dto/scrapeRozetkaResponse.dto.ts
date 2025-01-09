import { IsString, IsNumber } from 'class-validator';

export class ScrapeRozetkaResponseDto {
  @IsString()
  message: string;

  @IsNumber()
  totalProducts: number;
}
