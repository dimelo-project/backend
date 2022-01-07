import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';

@Controller('api/studies')
export class StudiesController {
  @Get()
  getAllStudies(
    @Query('skill') skill: string,
    @Query('ongoing') ongoing: string,
  ) {}

  @Get('/:id')
  getStudy(@Param('id', ParseIntPipe) id: number) {}

  @Post()
  createStudy() {}

  @Patch('/:id')
  updateStudy(@Param('id', ParseIntPipe) id: number) {}

  @Delete('/:id')
  deleteStudy(@Param('id', ParseIntPipe) id: number) {}

  @Get('/:study_id/comments')
  getAllCommentsOfStudy(@Param('study_id', ParseIntPipe) study_id: number) {}

  @Post('/:study_id/comments')
  createCommentOfStudy(@Param('study_id', ParseIntPipe) study_id: number) {}

  @Patch('/:study_id/comments/:id')
  updateCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:study_id/comments/:id')
  deleteCommentOfStudy(
    @Param('study_id', ParseIntPipe) study_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
