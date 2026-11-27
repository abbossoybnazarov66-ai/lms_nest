import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Role } from '../../../generated/prisma/client';

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

  @IsEnum(Role, {
    message: "Rol faqat ADMIN, MENTOR, ASSISTANT yoki STUDENT bo'lishi mumkin",
  })
  role: Role;

  @IsOptional()
  @IsString()
  photo?: string;
}
