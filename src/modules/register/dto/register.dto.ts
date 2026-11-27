import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "Ism bo'sh bo'lmasligi kerak" })
  @MinLength(3)
  @MaxLength(30)
  fullname: string;

  @Matches(/^\+998\d{9}$/, { message: "Telefon +998XXXXXXXXX bo'lsin" })
  phone: string;

  @IsString()
  @MinLength(4, { message: "Parol kamida 4 ta belgidan iborat bo'lsin" })
  password: string;

  @IsString()
@MinLength(4, { message: "Parol kamida 4 ta belgidan iborat bo'lsin" })
  confirmPassword: string;

}