import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';

@Controller('api/projects')
export class ProjectsController {
  @Get()
  getAllProjects(
    @Query('position') position: string,
    @Query('skill') skill: string,
    @Query('ongoing') ongoing: string,
  ) {}

  @Get('/:id')
  getProject(@Param('id', ParseIntPipe) id: number) {}

  @Post()
  createProject() {}

  @Patch('/:id')
  updateProject(@Param('id', ParseIntPipe) id: number) {}

  @Delete('/:id')
  deleteProject(@Param('id', ParseIntPipe) id: number) {}

  @Get('/:project_id/comments')
  getAllCommentsOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
  ) {}

  @Post('/:project_id/comments')
  createCommentOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
  ) {}

  @Patch('/:project_id/comments/:id')
  updateCommentOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:project_id/comments/:id')
  deleteCommentOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
