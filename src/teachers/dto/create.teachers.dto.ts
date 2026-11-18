import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTeacherDto {
  // ===== Majburiy =====

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

  // ===== Ixtiyoriy =====

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsInt({ message: "Tajriba butun son bo'lishi kerak" })
  @Min(0, { message: "Tajriba manfiy bo'lishi mumkin emas" })
  experience?: number;

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: "Portfolio to'g'ri havola bo'lishi kerak" })
  portfolio?: string;

  @IsOptional()
  @IsUrl({}, { message: "GitHub to'g'ri havola bo'lishi kerak" })
  github?: string;

  @IsOptional()
  @Matches(/^@\w{3,}$/, {
    message: "Telegram @username ko'rinishida bo'lishi kerak",
  })
  telegram?: string;

   @IsOptional()
  @IsUrl({}, { message: "LinkedIn to'g'ri havola bo'lishi kerak" })
  linkedin?: string;
}