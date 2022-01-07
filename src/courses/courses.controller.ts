import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

@Controller('api/courses')
export class CoursesController {
  @Get()
  getCourses(
    @Query('big') big: string,
    @Query('small') small: string,
    @Query('skill') skill: string,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ) {}

  @Get('/:id')
  getCourse(@Param('id', ParseIntPipe) id: number) {}

  @Get('/search')
  searchCourse(@Query('keyword') keyword: string) {}

  @Get('/likes/me')
  getLikedCourses() {}

  @Post('/likes/:id')
  likeCourse(@Param('id', ParseIntPipe) id: number) {}

  @Delete('/likes/:id')
  dislikeCourse(@Param('id', ParseIntPipe) id: number) {}

  @Get('/instructor/:instructor_id')
  getCoursesByInstructor(
    @Param('instructor_id', ParseIntPipe) instructor_id: number,
  ) {}
}
