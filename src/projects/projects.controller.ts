import { UpdateProjectDto } from './dto/update-project.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('PROJECT')
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @ApiOperation({ summary: '모든 프로젝트 받아오기' })
  @ApiQuery({
    name: 'position',
    required: false,
    description: '핉터링할 포지션',
  })
  @ApiQuery({
    name: 'skill',
    required: false,
    description: '필터링할 스킬',
  })
  @ApiQuery({
    name: 'ongoing',
    required: false,
    description: '모집중/모집완료',
  })
  @Get()
  getAllProjects(
    @Query('position') position: string,
    @Query('skill') skill: string,
    @Query('ongoing') ongoing: string,
  ) {}

  @ApiOperation({ summary: '해당 프로젝트 받아오기' })
  @ApiParam({
    name: 'id',
    required: false,
    description: 'project id',
  })
  @Get('/:id')
  getProject(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '프로젝트 글 작성하기' })
  @UseGuards(new LoggedInGuard())
  @Post()
  async createProject(
    @Body() body: CreateProjectDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.createProject(body, user.id);
  }

  @ApiOperation({ summary: '해당 프로젝트 글 수정하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project id',
  })
  @UseGuards(new LoggedInGuard())
  @Patch('/:id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.updateProject(id, body, user.id);
  }

  @ApiOperation({ summary: '해당 프로젝트 글 삭제하기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project id',
  })
  @UseGuards(new LoggedInGuard())
  @Delete('/:id')
  deleteProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.projectsService.deleteProject(id, user.id);
  }

  @ApiOperation({ summary: '해당 프로젝트의 모든 댓글 받아오기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @Get('/:project_id/comments')
  getAllCommentsOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
  ) {}

  @ApiOperation({ summary: '해당 프로젝트에 댓글 작성하기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @Post('/:project_id/comments')
  createCommentOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
  ) {}

  @ApiOperation({ summary: '해당 프로젝트의 해당 댓글 수정하기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project comment id',
  })
  @Patch('/:project_id/comments/:id')
  updateCommentOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @ApiOperation({ summary: '해당 프로젝트의 해당 댓글 삭제하기' })
  @ApiParam({
    name: 'project_id',
    required: true,
    description: 'project id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'project comment id',
  })
  @Delete('/:project_id/comments/:id')
  deleteCommentOfProject(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {}
}
