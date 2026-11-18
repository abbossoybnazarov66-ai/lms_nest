import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { staffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class staffController {
  constructor(private readonly staffService: staffService) { }

  @Get()
  getStaff() {
    return this.staffService.getStaff();
  }

  @Post()

  createStaff(@Body() payload: CreateStaffDto) {
    return this.staffService.createStaff(payload)

  }
  @Delete(":id")
    delelteStaff(@Param("id",ParseIntPipe) id : number){
       return this.staffService.deleteStaff(id)

    }

    @Put(":id")
     updateStaff(@Param("id",ParseIntPipe) id : number,@Body() payload : UpdateStaffDto){
       return this.staffService.updateStaff(id,payload)
    }
}