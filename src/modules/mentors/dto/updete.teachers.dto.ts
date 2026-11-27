import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create.teachers.dto';
import { IsIn,IsOptional } from 'class-validator';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
    @IsOptional()
    @IsIn(['active','inactive'],{message : "Status faqat 'active' yoki 'inactive' bo'lishi mumkin",})
    status?: string
}