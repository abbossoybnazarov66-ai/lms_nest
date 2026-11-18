import { Module } from '@nestjs/common';
import { staffController } from './staff.controller';
import { staffService } from './staff.service';

@Module({
  controllers: [staffController],
  providers: [staffService],
})
export class StaffModule {}