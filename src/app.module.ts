import { Module } from '@nestjs/common';
import { StaffModule } from './modules/users/staff.module';
import { teacherModule } from './modules/mentors/teacher.module';
import { StudentsModule } from './modules/students/students.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, StaffModule, teacherModule, StudentsModule, AuthModule]
})
export class AppModule { }
