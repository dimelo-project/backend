import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';

@Controller('api/talks')
export class TalksController {
  @Get()
  getAllTalks(@Query('category') category: string) {}

  @Get('/:id')
  getTalk(@Param('id', ParseIntPipe) id: number) {}

  @Post()
  createTalk() {}

  @Patch('/:id')
  updateTalk(@Param('id', ParseIntPipe) id: number) {}

  @Delete('/:id')
  deleteTalk(@Param('id', ParseIntPipe) id: number) {}

  @Get('/search')
  searchTalk(@Query('keyword') keyword: string) {}

  @Get('/:talk_id/comments')
  getAllCommentsOfTalk(@Param('talk_id', ParseIntPipe) talk_id: number) {}

  @Post('/:talk_id/comments')
  createCommentOfTalk(@Param('talk_id', ParseIntPipe) talk_id: number) {}

  @Patch('/:talk_id/comments/:id')
  updateCommentOfTalk(
    @Param('talk_id', ParseIntPipe) talk_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:talk_id/comments/:id')
  deleteCommentOfTalk(
    @Param('talk_id', ParseIntPipe) talk_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
