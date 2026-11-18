import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { pool } from '../database/db';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {

  async getStudents() {
    const result = await pool.query(
      `SELECT id, fullname, phone, photo, status, created_at
       FROM students
       WHERE status = 'active'
       ORDER BY id`,
    );

    return {
      message: "Barcha o'quvchilar",
      data: result.rows,
    };
  }

  async getOneStudent(id: number) {
    const result = await pool.query(
      `SELECT id, fullname, phone, photo, status, created_at
       FROM students
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    return {
      message: "O'quvchi topildi",
      data: result.rows[0],
    };
  }


  async createStudent(payload: CreateStudentDto) {
    const hashedPassword = await argon.hash(payload.password);

    try {
      const result = await pool.query(
        `INSERT INTO students (fullname, phone, password, photo)
         VALUES ($1, $2, $3, $4)
         RETURNING id, fullname, phone, photo, status, created_at`,
        [
          payload.fullname,       // $1
          payload.phone,          // $2
          hashedPassword,         // $3
          payload.photo ?? null,  // $4
        ],
      );

      return {
        message: "O'quvchi muvaffaqiyatli yaratildi",
        data: result.rows[0],
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
      }
      throw error;
    }
  }

  async updateStudent(id: number, payload: UpdateStudentDto) {
    const hashedPassword = payload.password
      ? await argon.hash(payload.password)
      : null;

    try {
      const result = await pool.query(
        `UPDATE students SET
           fullname = COALESCE($1, fullname),
           phone    = COALESCE($2, phone),
           password = COALESCE($3, password),
           photo    = COALESCE($4, photo),
           status = coalesce($5,status)
         WHERE id = $6
         RETURNING id, fullname, phone, photo, status, created_at`,
        [
          payload.fullname ?? null,  
          payload.phone ?? null,     
          hashedPassword,            
          payload.photo ?? null,    
          payload.status ?? null, 
          id                       
        ],
      );

      if (result.rowCount === 0) {
        throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
      }

      return {
        message: "O'quvchi yangilandi",
        data: result.rows[0],
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException("Bu telefon raqam boshqa o'quvchiga tegishli");
      }
      throw error;
    }
  }

  // ===== DELETE — soft delete =====
  async deleteStudent(id: number) {
    const result = await pool.query(
      `UPDATE students SET status = 'inactive'
       WHERE id = $1
       RETURNING id, fullname, status`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`${id}-raqamli o'quvchi topilmadi`);
    }

    return {
      message: "O'quvchi o'chirildi",
      data: result.rows[0],
    };
  }
}