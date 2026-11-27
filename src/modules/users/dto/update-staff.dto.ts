import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
    @IsOptional()
    @IsIn(['active', 'inactive'], {
        message: "Status faqat 'active' yoki 'inactive' bo'lishi mumkin",
    })
    status?: string;
}