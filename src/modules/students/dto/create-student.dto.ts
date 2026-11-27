import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: "Ism bo'sh bo'lmasligi kerak" })
  fullname!: string;

  @Matches(/^\+998\d{9}$/, {
    message: "Telefon +998XXXXXXXXX ko'rinishida bo'lishi kerak",
  })
  phone!: string;

  @IsString()
  @MinLength(4, { message: "Parol kamida 4 ta belgidan iborat bo'lsin" })
  password!: string;

  @IsOptional()
  @IsString()
  photo?: string;
}