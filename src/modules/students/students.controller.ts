import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put,UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards( AuthGuard)
  @Get()
  getStudents() {
    return this.studentsService.getStudents();
  }

  @Get(':id')
  getOneStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getOneStudent(id);
  }

  @Post()
  createStudent(@Body() payload: CreateStudentDto) {
    return this.studentsService.createStudent(payload);
  }

  @Put(':id')
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(id, payload);
  }

  @Delete(':id')
  deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.deleteStudent(id);
  }
}