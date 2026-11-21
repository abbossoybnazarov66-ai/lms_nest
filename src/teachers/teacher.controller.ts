import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { teacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create.teachers.dto';
import { UpdateTeacherDto } from './dto/updete.teachers.dto';
@Controller('teachers')
export class teacherController {
  constructor(private readonly teacherService: teacherService) { }

  @Get()
  getStaff() {
    return this.teacherService.getTeachers();
  }

  @Post()

  createStaff(@Body() payload:CreateTeacherDto ) {
    return this.teacherService.createTeacher(payload)

  }
  @Delete(":id")
    delelteTeacher(@Param("id",ParseIntPipe) id : number){
       return this.teacherService.deleteTeacher(id)

    }
 

  @Put(":id")
  updateTeacher(@Param("id",ParseIntPipe) id : number, @Body()payload: UpdateTeacherDto){
    return this.teacherService.updateTeacher(id,payload)
  }

}