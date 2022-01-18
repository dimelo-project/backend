import { ReviewsService } from './reviews.service';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('REVIEW')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @ApiOperation({ summary: '해당 강의의 모든 리뷰들 받아오기' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @Get('/:course_id')
  getAllReviewsOfCourse(@Param('course_id', ParseIntPipe) course_id: number) {}

  @ApiOperation({ summary: '해당 강의에 리뷰 작성하기' })
  @ApiParam({
    name: 'course_id',
    required: true,
    description: 'course id',
  })
  @Post('/:course_id')
  writeReview(@Param('course_id', ParseIntPipe) course_id: number) {}

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
  @Patch('/:course_id/:id')
  updateReview(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

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
  @Delete('/:course_id/:id')
  deleteReview(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @ApiOperation({ summary: '해당 강사의 모든 리뷰 받아오기' })
  @ApiParam({
    name: 'instructor_id',
    required: true,
    description: 'instructor id',
  })
  @Get('/instructors/:instructor_id')
  getAllReviewsOfInstructur(
    @Param('instructor_id', ParseIntPipe) instructor_id: number,
  ) {}

  @ApiOperation({ summary: '내가 작성한 모든 리뷰 받아오기' })
  @Get('/me')
  getMyAllReviews() {}

  @ApiOperation({ summary: '해당 유저가 작성한 모든 리뷰 받아오기' })
  @ApiParam({
    name: 'user_id',
    required: true,
    description: 'user id',
  })
  @Get('/users/:user_id')
  getAllReviewsByUser(@Param('user_id', ParseIntPipe) user_id: number) {}

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
  @Delete('/help/me/:id')
  async revokeThumbsUpOnReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.reviewsService.revokeThumbsUp(id, user.id);
  }
}
