import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../database/db';
import argon from "argon2"
import { CreateTeacherDto } from './dto/create.teachers.dto';
import { UpdateTeacherDto } from './dto/updete.teachers.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class teacherService {
  constructor(private readonly prisma: PrismaService) { }
  async getTeachers() {

    let teachers = await this.prisma.teacher.findMany()

    return {
      message: "barcha teacherlar",
      data: teachers
    }
  }
  async createTeacher(payload: CreateTeacherDto) {
    try {
      let hashedpass = await argon.hash(payload.password)

      await this.prisma.teacher.create({ data: { ...payload, password: hashedpass } })
      return {
        message: 'teacher muvaffaqiyatli yaratildi'
      };
    } catch (error: any) {
      if (error.code == '23505') {
        throw new ConflictException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
      }
    }
  }

  async deleteTeacher(id: number) {


    let results = await this.prisma.teacher.findUnique({ where: { id }, })
    if (!results) {
      throw new NotFoundException(`${id}-raqamli teacher topilmadi`)
    }

    await this.prisma.teacher.update({ where: { id }, data: { status: "inactive" } })
    return {
      message: "teacher is deleted "
    }

  }

  async updateTeacher(id: number, payload: UpdateTeacherDto) {

    try {
      const result = await this.prisma.teacher.findUnique({ where: { id } })

      if (!result) {
        throw new NotFoundException(`${id}-raqamli teacher topilmadi`);

      }
      if (payload.password) {
        payload.password = await argon.hash(payload.password);
      }

      let updated = await this.prisma.teacher.update({ where: { id }, data: payload, omit: { password: true } })

      return {
        message: 'Teacher yangilandi',
        data: updated,
      }
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException("Bu telefon raqam boshqa teacherga tegishli")
      }
      throw error;
    }
  }
}
