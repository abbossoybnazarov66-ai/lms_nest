import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../database/db';
import argon from "argon2"
import { CreateTeacherDto } from './dto/create.teachers.dto';
import { UpdateTeacherDto } from './dto/updete.teachers.dto';


@Injectable()
export class teacherService {
    async getTeachers() {

        let teachers = await pool.query(`select id, fullname, phone, experience, job, description, portfolio, github, telegram, linkedin, status from teachers
                 order by id `)

        return {
            message: "barcha teacherlar",
            data: teachers.rows
        }
    }
    async createTeacher(payload: CreateTeacherDto) {
        try {
            let hashedpass = await argon.hash(payload.password)

            const result = await pool.query(
                `INSERT INTO teachers
     (fullname, phone, password, photo, experience, job, description, portfolio, github, telegram)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
   RETURNING id, fullname, phone, job, experience, status`,
                [
                    payload.fullname,
                    payload.phone,
                    hashedpass,
                    payload.photo ?? null,
                    payload.experience ?? null,
                    payload.job ?? null,
                    payload.description ?? null,
                    payload.portfolio ?? null,
                    payload.github ?? null,
                    payload.telegram ?? null,
                ],
            );
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



        const results = await pool.query(
            "UPDATE teachers SET status = 'inactive' WHERE id = $1 RETURNING id, fullname, status",
            [id],
        )
        if (results.rows.length == 0) {
            throw new NotFoundException(`${id}-raqamli teacher topilmadi`)
        }


        return {
            message: "teacher is deleted "
        }

    }

    async updateTeacher(id: number, payload: UpdateTeacherDto) {
  const hashedPassword = payload.password
    ? await argon.hash(payload.password)
    : null;

  try {
    const result = await pool.query(
      `UPDATE teachers SET
         fullname    = COALESCE($1, fullname),
         phone       = COALESCE($2, phone),
         password    = COALESCE($3, password),
         photo       = COALESCE($4, photo),
         experience  = COALESCE($5, experience),
         job         = COALESCE($6, job),
         description = COALESCE($7, description),
         portfolio   = COALESCE($8, portfolio),
         github      = COALESCE($9, github),
         telegram    = COALESCE($10, telegram),
         linkedin    = COALESCE($11, linkedin)
       WHERE id = $12
       RETURNING id, fullname, phone, photo, experience, job, description,
                 portfolio, github, telegram, linkedin, status`,
      [
        payload.fullname ?? null,     // $1
        payload.phone ?? null,        // $2
        hashedPassword,               // $3
        payload.photo ?? null,        // $4
        payload.experience ?? null,   // $5
        payload.job ?? null,          // $6
        payload.description ?? null,  // $7
        payload.portfolio ?? null,    // $8
        payload.github ?? null,       // $9
        payload.telegram ?? null,     // $10
        payload.linkedin ?? null,     // $11
        id,                           // $12
      ],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`${id}-raqamli teacher topilmadi`);
    }

    return {
      message: 'Teacher yangilandi',
      data: result.rows[0],
    };
  } catch (error: any) {
    if (error.code === '23505') {
      throw new ConflictException("Bu telefon raqam boshqa teacherga tegishli");
    }
    throw error;
  }
}
}
