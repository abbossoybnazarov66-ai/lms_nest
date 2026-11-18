import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../database/db';
import argon from "argon2"
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class staffService {
  async getStaff() {

    let staffs = await pool.query(`SELECT id, fullname, phone, photo, role, status FROM staff ORDER BY id`)

    return {
      message: "barcha xodimlar",
      data: staffs.rows
    }
  }
  async createStaff(payload: CreateStaffDto) {
    let hashedpass = await argon.hash(payload.password)

    let results = await pool.query(` insert into staff (fullname,phone,password,role,photo) values($1,$2,$3,$4,$5)`, [payload.fullname, payload.phone, hashedpass, payload.role, payload.photo ?? null])
    return {
      message: 'Xodim muvaffaqiyatli yaratildi'
    };
  }

  async deleteStaff(id: number) {
    const results = await pool.query('select * from staff where id = $1', [id])

    if (results.rows.length == 0) {
      throw new NotFoundException(`${id}-raqamli xodim topilmadi`)
    }

    pool.query("update staff set status = 'incative' where id = $1", [id])

    return {
      message: "staff is deleted "
    }

  }

  async updateStaff(id: number, payload: UpdateStaffDto) {

    const hashedPassword = payload.password
      ? await argon.hash(payload.password)
      : null;


    let results = await pool.query(
      `UPDATE staff SET
       fullname = COALESCE($1, fullname),
       phone    = COALESCE($2, phone),
       password = COALESCE($3, password),
       role     = COALESCE($4, role),
       photo    = COALESCE($5, photo)
     WHERE id = $6
     RETURNING id, fullname, phone, photo, role, status`,
      [
        payload.fullname ?? null,
        payload.phone ?? null,
        hashedPassword,
        payload.role ?? null,
        payload.photo ?? null,
        id,
      ],
    );
    if (results.rows.length == 0) {
      throw new NotFoundException(`${id}-raqamli xodim topilmadi`)
    }

    return {
    message: 'Xodim yangilandi',
    data: results.rows[0],
  };

  }
}
