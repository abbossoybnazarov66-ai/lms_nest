import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { teacherModule } from './teachers/teacher.module';
import { StudentsModule } from './students/students.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),PrismaModule,StaffModule,teacherModule,StudentsModule]
})
export class AppModule {}
