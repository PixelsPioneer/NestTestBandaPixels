import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;
}

export class SubcategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [SectionDto] })
  @IsArray()
  sections: SectionDto[];
}

export class ScrapedCategoryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [SubcategoryDto] })
  @IsArray()
  subcategories: SubcategoryDto[];
}
