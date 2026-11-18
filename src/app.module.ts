import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { teacherModule } from './teachers/teacher.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [StaffModule,teacherModule,StudentsModule]
})
export class AppModule {}
