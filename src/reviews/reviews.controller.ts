import { PositiveIntPipe } from './../common/pipes/positiveInt.pipe';
import { CreateReviewWithCourseDto } from './dto/create-review-with-course.dto';
import { GetReviewsByInstructorDto } from './dto/get-reviews-by-instructor.dto';
import { GetReviewsByCourseDto } from './dto/get-reviews-by-course.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { MailService } from '../mail/mail.service';

@ApiTags('REVIEW')
@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly mailService: MailService,
  ) {}
  @ApiOkResponse({
    description: '리뷰 개수 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id, parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({
    summary: '해당 강의의 리뷰 전체 개수 가져오기',
  })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @Get('courses/:course_id/count')
  async getCountOfReviewsOfCourse(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
  ) {
    return this.reviewsService.getCountByCourse(course_id);
  }

  @ApiOkResponse({
    description: '강의 평점 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강의의 평점 보기' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @Get('courses/:course_id/avg')
  async getAverageOfCourse(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
  ) {
    return this.reviewsService.getAverageOfCourse(course_id);
  }

  @ApiOkResponse({
    description: '리뷰 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id, parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({
    summary: '해당 강의의 리뷰를 추천순/최신순/평점순으로 받아오기',
  })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @Get('courses/:course_id')
  async getReviewsOfCourse(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
    @Query() query: GetReviewsByCourseDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.reviewsService.getByCourse(course_id, query, user);
  }

  @ApiResponse({
    status: 201,
    description: '리뷰 작성 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id, body값을 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않았을 경우',
  })
  @ApiResponse({
    status: 403,
    description:
      '프로필을 작성하지 않았을 경우 / 이미 해당 강의에 리뷰를 작성했을 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강의에 리뷰 작성하기' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('courses/:course_id')
  async createReviewOfCourse(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.createReview(course_id, body, user.id);
  }

  @ApiOkResponse({
    description: '리뷰 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id, review id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않았을 경우',
  })
  @ApiResponse({
    status: 403,
    description: '권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의, 리뷰를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강의에 해당 리뷰 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('courses/:course_id/:id')
  async getReviewOfCourse(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.getReview(course_id, id, user.id);
  }

  @ApiOkResponse({
    description: '리뷰 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id, review id, body값을 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않았을 경우',
  })
  @ApiResponse({
    status: 403,
    description: '수정 권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의, 리뷰를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강의의 해당 리뷰 수정' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Patch('courses/:course_id/:id')
  async updateReviewOfCourse(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.updateReview(course_id, id, body, user.id);
  }

  @ApiOkResponse({
    description: '리뷰 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'course id, review id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않았을 경우',
  })
  @ApiResponse({
    status: 403,
    description: '삭제 권한이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강의, 리뷰를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강의의 해당 리뷰 삭제' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('courses/:course_id/:id')
  async deleteReview(
    @Param('course_id', ParseIntPipe, PositiveIntPipe) course_id: number,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.deleteReview(course_id, id, user.id);
  }

  @ApiOkResponse({
    description: '해당 강사의 리뷰 개수 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'instructor id, parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강사를 찾을 수 없는 경우',
  })
  @ApiOperation({
    summary: '해당 강사의 모든 리뷰 개수 받아오기',
  })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: 'instructor id',
  })
  @Get('/instructors/:instructor_id/count')
  async getCountOfReviewsOfInstructor(
    @Param('instructor_id', ParseIntPipe, PositiveIntPipe)
    instructor_id: number,
  ) {
    return this.reviewsService.getCountByInstructor(instructor_id);
  }

  @ApiOkResponse({
    description: '해당 강사의 평점받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'instructor id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강사를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 강사의 평점 보기' })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: 'instructor id',
  })
  @Get('/instructors/:instructor_id/avg')
  async getAverageOfInstructur(
    @Param('instructor_id', ParseIntPipe, PositiveIntPipe)
    instructor_id: number,
  ) {
    return this.reviewsService.getAverageOfInstructor(instructor_id);
  }

  @ApiOkResponse({
    description: '리뷰 받아오기 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'instructor id, parameter를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 강사를 찾을 수 없는 경우',
  })
  @ApiOperation({
    summary: '해당 강사의 리뷰 추천순/최신순/평점순으로 받아오기',
  })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: 'instructor id',
  })
  @Get('/instructors/:instructor_id')
  async getReviewsOfInstructor(
    @Param('instructor_id', ParseIntPipe, PositiveIntPipe)
    instructor_id: number,
    @Query() query: GetReviewsByInstructorDto,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    return this.reviewsService.getByInstructor(instructor_id, query, user);
  }

  @ApiResponse({
    status: 201,
    description: '해당 리뷰 도움됨 누름',
  })
  @ApiResponse({
    status: 400,
    description: 'review id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 리뷰에 이미 도움됨 누른 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 리뷰를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 리뷰 도움됨 누르기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/help/:id')
  async giveThumbsUpOnReview(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.giveThumbsUp(id, user.id);
  }

  @ApiOkResponse({
    description: '해당 리뷰 도움됨 취소',
  })
  @ApiResponse({
    status: 400,
    description: 'review id를 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 리뷰에 이전에 도움됨 누른적이 없는 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 리뷰를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '해당 리뷰 도움됨 취소' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/help/:id')
  async revokeThumbsUpOnReview(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.revokeThumbsUp(id, user.id);
  }

  @ApiOkResponse({
    description: '리뷰 받아오기 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 작성한 모든 리뷰 최신순으로 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/me')
  async getMyAllReviews(@CurrentUser() user: CurrentUserDto) {
    return this.reviewsService.getMyReviews(user.id);
  }

  @ApiResponse({
    status: 201,
    description: '강의 신청 및 리뷰 작성 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'body 값을 제대로 전달 하지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '프로필을 설정하지 않은 경우',
  })
  @ApiResponse({
    status: 409,
    description: '이메일 전송 실패한 경우',
  })
  @ApiOperation({ summary: '강의 신청하고 리뷰쓰기' })
  @UseGuards(new LoggedInGuard())
  @Post()
  async createReviewWithCourse(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CreateReviewWithCourseDto,
  ) {
    return this.mailService.sendReview(user.id, body);
  }
}
