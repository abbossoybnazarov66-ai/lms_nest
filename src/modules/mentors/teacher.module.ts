import { Module } from '@nestjs/common';
import { teacherController } from './teacher.controller';
import { teacherService } from './teacher.service';

@Module({
  controllers: [teacherController],
  providers: [teacherService],
})
export class teacherModule {}