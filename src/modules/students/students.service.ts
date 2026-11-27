import { ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import argon from 'argon2';
import { PrismaService } from '../../core/database/prisma.service';
import { Role } from '../../generated/prisma/enums';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';


@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudents() {
    const students = await this.prisma.user.findMany({
      where: { status: 'active',role : Role.STUDENT },
      omit: { password: true },
    });

    return { message: "Barcha o'quvchilar", data: students };
  }

  async getOneStudent(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id,role : Role.STUDENT },
      omit: { password: true },
    });

    if (!student) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    return { message: "O'quvchi topildi", data: student };
  }


  async createStudent(payload: CreateStudentDto) {
    const exists = await this.prisma.user.findUnique({
    where: { phone: payload.phone },
  });
  if (exists) {
    throw new ConflictException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
  }
   const hashedPassword = await argon.hash(payload.password);
   
    const student = await this.prisma.user.create({
      data: { ...payload, password: hashedPassword,role : Role.STUDENT },
      omit: { password: true },
    });
    

    return { message: "O'quvchi yaratildi", data: student };
  }


  async updateStudent(id: number, payload: UpdateStudentDto) {
    const student = await this.prisma.user.findUnique({ where: { id,role : Role.STUDENT } });

    if (!student) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    if (payload.password) {
      payload.password = await argon.hash(payload.password);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: payload,
      omit: { password: true },
    });

    return { message: "O'quvchi yangilandi", data: updated };
  }

  
  async deleteStudent(id: number) {
    const student = await this.prisma.user.findUnique({ where: { id,role : Role.STUDENT } });

    if (!student) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: "O'quvchi o'chirildi" };
  }
}