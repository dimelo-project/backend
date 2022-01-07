import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('api/reviews')
export class ReviewsController {
  @Get('/:course_id')
  getAllReviewsOfCourse(@Param('course_id', ParseIntPipe) course_id: number) {}

  @Post('/:course_id')
  writeReview(@Param('course_id', ParseIntPipe) course_id: number) {}

  @Patch('/:course_id/:id')
  updateReview(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:course_id/:id')
  deleteReview(
    @Param('course_id', ParseIntPipe) course_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Get('/instructors/:instructor_id')
  getAllReviewsOfInstructur(
    @Param('instructor_id', ParseIntPipe) instructor_id: number,
  ) {}

  @Get('/me')
  getMyAllReviews() {}

  @Get('/users/:user_id')
  getAllReviewsByUser(@Param('user_id', ParseIntPipe) user_id: number) {}

  @Post('/helped/:id')
  giveThumsUp(@Param('id', ParseIntPipe) id: number) {}

  @Delete('/helped/:id')
  revokeThumsUp(@Param('id', ParseIntPipe) id: number) {}
}
