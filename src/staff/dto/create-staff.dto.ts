import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998\d{9}$/, {
    message: "Telefon +998XXXXXXXXX ko'rinishida bo'lishi kerak",
  })
  phone: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  photo?: string;
}