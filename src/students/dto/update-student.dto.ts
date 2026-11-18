import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  @IsIn(['active', 'inactive'], {
    message: "Status faqat 'active' yoki 'inactive' bo'lishi mumkin",
  })
  status?: string;
}