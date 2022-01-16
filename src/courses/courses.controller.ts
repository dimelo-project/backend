import { CoursesService } from './courses.service';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
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
    name: 'big',
    required: false,
    description: '카테고리 big',
  })
  @ApiQuery({
    name: 'small',
    required: false,
    description: '카테고리 small',
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
  getCourses(
    @Query('big') big: string,
    @Query('small') small: string,
    @Query('skill') skill: string,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ) {}

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

  @ApiOperation({ summary: '강의 검색하기' })
  @ApiQuery({
    name: 'keyword',
    required: true,
    description: '검색할 강의제목이나 강사',
  })
  @Get('/search')
  searchCourse(@Query('keyword') keyword: string) {}

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
}
