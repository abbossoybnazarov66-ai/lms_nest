import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';
import { CreateTeacherDto } from './dto/create.teachers.dto';
import { UpdateTeacherDto } from './dto/updete.teachers.dto';
import { PrismaService } from '../../core/database/prisma.service';
import { Role } from '../../generated/prisma/enums';

@Injectable()
export class teacherService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeachers() {
    const teachers = await this.prisma.user.findMany({
      where: { status: 'active', role: Role.MENTOR },
      omit: { password: true },
      orderBy: { id: 'asc' },
    });

    return { message: 'barcha teacherlar', data: teachers };
  }

  async createTeacher(payload: CreateTeacherDto) {
    // Asosiy ma'lumot (users) va mentorga xos ma'lumotni (mentor_profiles) ajratamiz
    const { experience, job, description, portfolio, github, telegram, linkedin, ...userData } =
      payload;
    const profile = { experience, job, description, portfolio, github, telegram, linkedin };

    const exists = await this.prisma.user.findUnique({
      where: { phone: userData.phone },
    });
    if (exists) {
      throw new ConflictException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
    }

    const hashedPassword = await argon.hash(userData.password);

    const teacher = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: Role.MENTOR,
        mentorProfile: { create: profile },
      },
      omit: { password: true },
    });

    return { message: 'Teacher muvaffaqiyatli yaratildi', data: teacher };
  }

  async updateTeacher(id: number, payload: UpdateTeacherDto) {
    const teacher = await this.prisma.user.findUnique({
      where: { id, role: Role.MENTOR },
    });
    if (!teacher) {
      throw new NotFoundException(`${id}-raqamli teacher topilmadi`);
    }

    const { experience, job, description, portfolio, github, telegram, linkedin, ...userData } =
      payload;
    const profile = { experience, job, description, portfolio, github, telegram, linkedin };

    if (userData.password) {
      userData.password = await argon.hash(userData.password);
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          mentorProfile: { upsert: { create: profile, update: profile } },
        },
        omit: { password: true },
       
      });

      return { message: 'Teacher yangilandi', data: updated };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Bu telefon raqam boshqa foydalanuvchiga tegishli');
      }
      throw error;
    }
  }

  async deleteTeacher(id: number) {
    const teacher = await this.prisma.user.findUnique({
      where: { id, role: Role.MENTOR },
    });
    if (!teacher) {
      throw new NotFoundException(`${id}-raqamli teacher topilmadi`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: "Teacher o'chirildi" };
  }
}
