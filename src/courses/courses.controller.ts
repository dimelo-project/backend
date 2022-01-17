import { SearchCoursesDto } from './dto/search-course.dto';
import { GetCoursesDto } from './dto/get-courses.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesService } from './courses.service';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('COURSE')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @ApiOperation({ summary: '강의들 받아오기' })
  @ApiQuery({
    name: 'categoryBig',
    required: true,
    description: '큰 카테고리: 개발, 데이터 과학, 디자인 중 하나',
  })
  @ApiQuery({
    name: 'category',
    required: true,
    description: '큰 카테고리 내 카테고리',
  })
  @ApiQuery({
    name: 'skill',
    required: false,
    description: '기술',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한 번에 가져오는 개수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @Get()
  getCourses(@Query() query: GetCoursesDto) {
    console.log(query);
    return this.coursesService.findAll(query);
  }

  @ApiOperation({ summary: '해당 강의 정보 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'course id',
  })
  @Get('/:id')
  getCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findById(id);
  }

  @Post('/search')
  searchCoursesFromAll(
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
    @Body() body: SearchCoursesDto,
  ) {
    return this.coursesService.searchFromAll(perPage, page, body);
  }

  @ApiOperation({ summary: '카테고리 내 강의 검색하기' })
  @ApiQuery({
    name: 'keyword',
    required: true,
    description: '검색할 강의제목이나 강사',
  })
  @Post('/category/search')
  searchCoursesFromCategory(
    @Query() query: GetCoursesDto,
    @Body() body: SearchCoursesDto,
  ) {
    return this.coursesService.searchFromCategory(query, body);
  }

  @ApiOperation({ summary: '내가 북마크한 강의 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/likes/me')
  getCoursesLiked(@CurrentUser() user: CurrentUserDto) {
    return this.coursesService.getLiked(user.id);
  }

  @ApiOperation({ summary: '강의 북마크 하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'course id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/likes/:id')
  likeCourse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.coursesService.addLike(id, user.id);
  }

  @ApiOperation({ summary: '강의 북마크 취소' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'course id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/likes/:id')
  dislikeCourse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.coursesService.removeLike(id, user.id);
  }

  @ApiOperation({ summary: '해당 강사의 모든 강의 받아오기' })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: 'instrouctor id',
  })
  @Get('/instructors/:instructor_id')
  getCoursesByInstructor(
    @Param('instructor_id', ParseIntPipe) instructor_id: number,
  ) {
    return this.coursesService.findByInstructor(instructor_id);
  }

  @ApiOperation({ summary: '해당 기술의 강의 모두 받아오기' })
  @ApiParam({
    name: 'skill_name',
    required: true,
    description: 'skill name',
  })
  @Get('/skills/:skill_name')
  getCoursesBySkill(@Param('skill_name') skill_name: string) {
    return this.coursesService.findBySkill(skill_name);
  }

  @Post()
  createCourseForAdmin(@Body() body: CreateCourseDto) {
    return this.coursesService.createCourse(body);
  }
}
