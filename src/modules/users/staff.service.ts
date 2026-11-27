import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from '../../core/database/prisma.service';
import { Role } from '../../generated/prisma/client';

@Injectable()
export class staffService {
  constructor(private readonly prisma: PrismaService) {}

  async getStaff() {
    const staffs = await this.prisma.user.findMany({
      where: { status: 'active', role: { not: Role.STUDENT } },
      omit: { password: true },
      orderBy: { id: 'asc' },
    });

    return {
      message: 'barcha xodimlar',
      data: staffs,
    };
  }

  async createStaff(payload: CreateStaffDto) {
    const exists = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (exists) {
      throw new ConflictException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
    }

    const hashedPassword = await argon.hash(payload.password);

    const staff = await this.prisma.user.create({
      data: { ...payload, password: hashedPassword },
      omit: { password: true },
    });

    return {
      message: 'Xodim muvaffaqiyatli yaratildi',
      data: staff,
    };
  }

  async deleteStaff(id: number) {
    const staff = await this.prisma.user.findUnique({
      where: { id, role: { not: Role.STUDENT } },
    });

    if (!staff) {
      throw new NotFoundException(`${id}-raqamli xodim topilmadi`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return {
      message: "Xodim o'chirildi",
    };
  }

  async updateStaff(id: number, payload: UpdateStaffDto) {
    const staff = await this.prisma.user.findUnique({
      where: { id, role: { not: Role.STUDENT } },
    });

    if (!staff) {
      throw new NotFoundException(`${id}-raqamli xodim topilmadi`);
    }

    if (payload.password) {
      payload.password = await argon.hash(payload.password);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: payload,
      omit: { password: true },
    });

    return {
      message: 'Xodim yangilandi',
      data: updated,
    };
  }
}
