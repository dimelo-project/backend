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
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('COURSE')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @ApiOkResponse({
    description: '강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiOperation({ summary: '해당 카테고리 내의 강의들 모두 받아오기' })
  @Get()
  async getCourses(@Query() query: GetCoursesDto) {
    console.log(query);
    return this.coursesService.findAll(query);
  }

  @ApiOkResponse({
    description: '강의 생성 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'body를 제대로 전달 하지 않은 경우',
  })
  @ApiOperation({ summary: '강의 생성하기 (for Admin)' })
  @Post()
  async createCourseForAdmin(@Body() body: CreateCourseDto) {
    return this.coursesService.createCourse(body);
  }

  @ApiOkResponse({
    description: '강의 받아오기 성공',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강의 정보 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'course id',
  })
  @Get('/:id')
  async getCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findById(id);
  }

  @ApiOkResponse({
    description: '검색 강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter와 keyword를 제공하지 않은 경우',
  })
  @ApiOperation({ summary: '전체 메뉴에서 제목, 강사로 강의 검색하기' })
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
  @Post('/search')
  async searchCoursesFromAll(
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
    @Body() body: SearchCoursesDto,
  ) {
    return this.coursesService.searchFromAll(perPage, page, body.keyword);
  }

  @ApiOkResponse({
    description: '검색 강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter와 keyword를 제공하지 않은 경우',
  })
  @ApiOperation({ summary: '카테고리 내에서 제목, 강사로 강의 검색하기' })
  @Post('/category/search')
  async searchCoursesFromCategory(
    @Query() query: GetCoursesDto,
    @Body() body: SearchCoursesDto,
  ) {
    return this.coursesService.searchFromCategory(query, body.keyword);
  }

  @ApiOkResponse({
    description: '북마크 한 강의 받아오기 성공',
  })
  @ApiResponse({
    status: 403,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 북마크한 강의 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/likes/me')
  async getCoursesLiked(@CurrentUser() user: CurrentUserDto) {
    return this.coursesService.getLiked(user.id);
  }

  @ApiOkResponse({
    description: '강의 북마크 성공',
  })
  @ApiResponse({
    status: 400,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiResponse({
    status: 403,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '강의 북마크 하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'course id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/likes/:id')
  async likeCourse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.coursesService.addLike(id, user.id);
  }

  @ApiOkResponse({
    description: '강의 북마크 취소 성공',
  })
  @ApiResponse({
    status: 400,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiResponse({
    status: 403,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '강의 북마크 취소' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'course id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/likes/:id')
  async removelikeCourse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.coursesService.removeLike(id, user.id);
  }

  @ApiOkResponse({
    description: '해당 강사 강의들 불러오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: '해당 강사를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강사의 모든 강의 받아오기' })
  @ApiParam({
    name: 'name',
    required: true,
    description: '해당 강사 이름',
  })
  @Get('/instructors/:name')
  async getCoursesByInstructor(@Param('name') name: string) {
    return this.coursesService.findByInstructor(name);
  }

  @ApiOkResponse({
    description: '해당 기술 강의들 불러오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: '해당 기술의 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 기술의 강의 모두 받아오기' })
  @ApiParam({
    name: 'skill',
    required: true,
    description: '기술 이름',
  })
  @Get('/skills/:skill')
  async getCoursesBySkill(@Param('skill') skill: string) {
    return this.coursesService.findBySkill(skill);
  }
}
