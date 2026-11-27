import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @Matches(/^\+998\d{9}$/, { message: "Telefon +998XXXXXXXXX bo'lsin" })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  password: string;
}
