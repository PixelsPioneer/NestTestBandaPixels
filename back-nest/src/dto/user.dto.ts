import { IsString, IsNumber } from 'class-validator';

export class UserDto {
  @IsNumber()
  id: string;

  @IsString()
  role: string;
}
