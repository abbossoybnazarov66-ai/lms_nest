import { Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudents() {
    const students = await this.prisma.student.findMany({
      where: { status: 'active' },
      omit: { password: true },
    });

    return { message: "Barcha o'quvchilar", data: students };
  }

  async getOneStudent(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!student) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    return { message: "O'quvchi topildi", data: student };
  }


  async createStudent(payload: CreateStudentDto) {
    const hashedPassword = await argon.hash(payload.password);

    const student = await this.prisma.student.create({
      data: { ...payload, password: hashedPassword },
      omit: { password: true },
    });

    return { message: "O'quvchi yaratildi", data: student };
  }


  async updateStudent(id: number, payload: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({ where: { id } });

    if (!student) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    if (payload.password) {
      payload.password = await argon.hash(payload.password);
    }

    const updated = await this.prisma.student.update({
      where: { id },
      data: payload,
      omit: { password: true },
    });

    return { message: "O'quvchi yangilandi", data: updated };
  }

  
  async deleteStudent(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });

    if (!student) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    await this.prisma.student.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: "O'quvchi o'chirildi" };
  }
}