import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { PrismaService } from '../../core/database/prisma.service';
import { Role } from '../../generated/prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }


  async register(payload: RegisterDto) {
    const { confirmPassword, ...data } = payload;


    if (data.password !== confirmPassword) {
      throw new BadRequestException('Parollar mos kelmadi');
    }


    const exists = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (exists) {
      throw new ConflictException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
    }


    const hashedPassword = await argon.hash(data.password);

    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword, role: Role.STUDENT },
      omit: { password: true },
    });

    return { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", data: user };
  }


  async login(payload: LoginDto) {

    const { phone, password } = payload

    const user = await this.prisma.user.findUnique({ where: { phone } })

    if (!user || user.status == "inactive") {
      throw new NotFoundException('Login yoki parol xato kiritildi')
    }
    const isValid = await argon.verify(user.password, password)
    if (!isValid) {
      throw new UnauthorizedException()
    }
    const tokenData = { id: user.id, role: user.role }

    const AccesToken = await this.jwt.signAsync(tokenData, { secret: this.config.getOrThrow<string>("ACCESS_SECRET"), expiresIn: "30m" })
    const RefreshToken = await this.jwt.signAsync(tokenData, { secret: this.config.getOrThrow<string>("REFRESH_SECRET"), expiresIn: "7d" })

     return {
    message: 'Muvaffaqiyatli kirdingiz',
    AccesToken,
    role : user.role,
    RefreshToken,
  };


  }
} 