import { PositiveIntPipe } from '../common/pipes/positiveInt.pipe';
import { GetCountCoursesDto } from './dto/get-count-courses.dto';
import { GetSkillsFromCategoryDto } from './dto/get-skills-from-category.dto';
import { SearchCoursesDto } from './dto/search-course.dto';
import { GetCoursesFromCategoryDto } from './dto/get-courses-from-category.dto';
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
import { GetCoursesFromAllDto } from './dto/get-courses-from-all.dto';

@ApiTags('COURSE')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiResponse({
    status: 201,
    description: '검색한 강의 결과 개수 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'keyword를 제공하지 않은 경우',
  })
  @ApiOperation({
    summary: '전체 메뉴에서 제목, 강사로 강의 검색한 강의 개수 받아오기',
  })
  @Post('/search/count')
  async getCountOfCourseForSearchFromAll(@Body() body: SearchCoursesDto) {
    return this.coursesService.getCountBySearchFromAll(body.keyword);
  }

  @ApiResponse({
    status: 201,
    description: '검색 강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter와 keyword를 제공하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 키워드의 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '전체 메뉴에서 제목, 강사로 강의 검색하기' })
  @Post('/search')
  async searchCoursesFromAll(
    @Query() query: GetCoursesFromAllDto,
    @Body() body: SearchCoursesDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.coursesService.searchFromAll(query, body.keyword, user);
  }

  @ApiResponse({
    status: 201,
    description: '검색한 강의 결과 개수 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'keyword를 제공하지 않은 경우',
  })
  @ApiOperation({
    summary: '카테고리 내 에서 제목, 강사로 강의 검색한 강의 개수 받아오기',
  })
  @Post('/category/search/count')
  async getCountOfCourseBySearchFromCategory(
    @Query() query: GetCountCoursesDto,
    @Body() body: SearchCoursesDto,
  ) {
    return this.coursesService.getCountBySearchFromCategory(
      query,
      body.keyword,
    );
  }

  @ApiResponse({
    status: 201,
    description: '검색 강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter와 keyword를 제공하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 키워드의 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '카테고리 내에서 제목, 강사로 강의 검색하기' })
  @Post('/category/search')
  async searchCoursesFromCategory(
    @Query() query: GetCoursesFromCategoryDto,
    @Body() body: SearchCoursesDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.coursesService.searchFromCategory(query, body.keyword, user);
  }

  @ApiResponse({
    status: 200,
    description: '기술들 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter를 제공하지 않은 경우',
  })
  @ApiOperation({ summary: '해당 카테고리 내 인기 기술들 받아오기' })
  @Get('category/skills')
  async getPopularSkillsFromCategory(@Query() query: GetSkillsFromCategoryDto) {
    return this.coursesService.getSkillsFromCategory(query);
  }

  @ApiResponse({
    status: 200,
    description: '해당 기술 강의 개수 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'skill_id을 제공하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 기술을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 기술의 강의 개수 받아 오기' })
  @Get('/skills/:skill_id/count')
  async getCountOfCourseBySkill(
    @Param('skill_id', ParseIntPipe, PositiveIntPipe) skill_id: number,
  ) {
    return this.coursesService.getCountBySkill(skill_id);
  }

  @ApiResponse({
    status: 200,
    description: '강의들 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'skill_id을 제공하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 기술을 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 기술의 강의들 받아 오기' })
  @Get('/skills/:skill_id')
  async getCoursesBySkill(
    @Param('skill_id', ParseIntPipe, PositiveIntPipe) skill_id: number,
    @Query() query: GetCoursesFromAllDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.coursesService.findBySkill(skill_id, query, user);
  }

  @ApiResponse({
    status: 200,
    description: '기술키워드 받아오기 성공 (7개)',
  })
  @ApiOperation({
    summary:
      '전체 카테고리에서 인기 기술 키워드 가져오기 (전체검색에서 검색 결과가 없을 시)',
  })
  @Get('/skills')
  async getPopularSkillsFromAll() {
    return this.coursesService.getCourseSkills();
  }

  @ApiOkResponse({
    description: '북마크 한 강의 받아오기 성공 (북마크 한 순으로 내림차순)',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 북마크한 강의 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/likes/me')
  async getCoursesLiked(@CurrentUser() user: CurrentUserDto) {
    return this.coursesService.getLiked(user.id);
  }

  @ApiResponse({
    status: 201,
    description: '강의 북마크 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id를 제대로 보내지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 강의를 이미 북마크 한 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
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
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.coursesService.addLike(id, user.id);
  }

  @ApiOkResponse({
    description: '강의 북마크 취소 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id를 제대로 보내지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 강의를 이 전에 북마크 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
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
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.coursesService.removeLike(id, user.id);
  }

  @ApiOkResponse({
    description: '해당 강사 강의들 불러오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'instructor id를 제대로 보내지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강사를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강사의 모든 강의 개수 받아오기' })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: '해당 강사 id',
  })
  @Get('/instructors/:instructor_id/count')
  async getCountOfCoursesByInstructor(
    @Param('instructor_id', ParseIntPipe, PositiveIntPipe)
    instructor_id: number,
  ) {
    return this.coursesService.getCountByInstructor(instructor_id);
  }

  @ApiOkResponse({
    description: '해당 강사 강의들 불러오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'instructor id, parameter를 제대로 보내지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강사를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강사의 모든 강의 받아오기' })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: '해당 강사 id',
  })
  @Get('/instructors/:instructor_id')
  async getCoursesByInstructor(
    @Param('instructor_id', ParseIntPipe, PositiveIntPipe)
    instructor_id: number,
    @Query() query: GetCoursesFromAllDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.coursesService.findByInstructor(instructor_id, query, user);
  }

  @ApiOkResponse({
    description: '강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiOperation({ summary: '해당 카테고리 내의 강의들 개수 받아오기' })
  @Get('/count')
  async getCountOfCourseFromCategory(@Query() query: GetCountCoursesDto) {
    return this.coursesService.getCountFromCategory(query);
  }

  @ApiOkResponse({
    description: '강의 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiOperation({ summary: '해당 카테고리 내의 강의들 모두 받아오기' })
  @Get()
  async getCoursesFromCategory(
    @Query() query: GetCoursesFromCategoryDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.coursesService.getFromCategory(query, user);
  }

  @ApiResponse({
    status: 201,
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
    status: 400,
    description: 'course id를 제대로 보내지 않은 경우',
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
  async getCourse(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.coursesService.findById(id, user);
  }
}
