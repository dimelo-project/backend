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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('REVIEW')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @ApiOperation({ summary: '내가 작성한 모든 리뷰 받아오기' })
  @UseGuards(new LoggedInGuard())
  @Get('/me')
  async getMyAllReviews(@CurrentUser() user: CurrentUserDto) {
    return this.reviewsService.getMyReviews(user.id);
  }

  @ApiOperation({ summary: '해당 강사의 모든 리뷰 받아오기' })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: 'instructor id',
  })
  @Get('/instructors/:instructor_id')
  async getAllReviewsOfInstructur(
    @Param('instructor_id', ParseIntPipe) instructor_id: number,
  ) {
    return this.reviewsService.getReviewsByInstructor(instructor_id);
  }

  @ApiOperation({ summary: '해당 리뷰 도움됨 갯수 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @Get('/help/:id')
  async getCountofThumbsUp(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.checkThumbsUpCount(id);
  }

  @ApiOperation({ summary: '해당 리뷰 내가 도움됨 눌렀는지 체크' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Get('/help/me/:id')
  async checkIgaveThumbsUp(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.checkIgaveThumbsUp(id, user.id);
  }

  @ApiOperation({ summary: '해당 리뷰 도움됨 누르기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/help/me/:id')
  async giveThumbsUpOnReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.giveThumbsUp(id, user.id);
  }

  @ApiOperation({ summary: '해당 리뷰 도움됨 취소' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'review id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/help/me/:id')
  async revokeThumbsUpOnReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.revokeThumbsUp(id, user.id);
  }

  @ApiOperation({ summary: '해당 강의의 모든 리뷰들 받아오기' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @Get('/:course_id')
  async getAllReviewsOfCourse(
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    return this.reviewsService.getReviewsByCourse(course_id);
  }

  @ApiOperation({ summary: '해당 강의에 리뷰 작성하기' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @UseGuards(new LoggedInGuard())
  @Post('/:course_id')
  async createReviewOfCourse(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.writeReview(course_id, body, user.id);
  }

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
  @Patch('/:course_id/:id')
  updateReviewOfCourse(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.updateReview(course_id, id, body, user.id);
  }

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
  @Delete('/:course_id/:id')
  deleteReview(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.deleteReview(course_id, id, user.id);
  }
}
