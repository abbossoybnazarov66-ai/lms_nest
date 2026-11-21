import { Injectable, NotFoundException } from '@nestjs/common';
import argon from "argon2"
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class staffService {
  constructor(private readonly prisma: PrismaService) { }
  async getStaff() {

    let staffs = await this.prisma.staff.findMany()
    return {
      message: "barcha xodimlar",
      data: staffs
    }


  }

  async createStaff(payload: CreateStaffDto) {
    const hashedPassword = await argon.hash(payload.password);

    await this.prisma.staff.create({
      data: {
        ...payload,
        password: hashedPassword
      }
    })
    return {
      message: 'Xodim muvaffaqiyatli yaratildi'
    };
  }

  async deleteStaff(id: number) {
    const results = await this.prisma.staff.findUnique({ where: { id }, })

    if (!results) {
      throw new NotFoundException(`${id}-raqamli xodim topilmadi`)
    }

    await this.prisma.staff.update({ where: { id }, data: { status: "inactive" }, })

    return {
      message: "staff is deleted "
    }

  }

  async updateStaff(id: number, payload: UpdateStaffDto) {
  const results = await this.prisma.staff.findUnique({ where: { id } });

  if (!results) {
    throw new NotFoundException(`${id}-raqamli xodim topilmadi`);
  }

  if (payload.password) {
    payload.password = await argon.hash(payload.password);
  }

  const updated = await this.prisma.staff.update({
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