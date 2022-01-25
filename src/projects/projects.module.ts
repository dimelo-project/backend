import { ProjectsComments } from './../entities/ProjectsComments';
import { ProjectsPositions } from './../entities/ProjectsPositions';
import { ProjectsSkills } from './../entities/ProjectsSkills';
import { Projects } from './../entities/Projects';
import { Users } from './../entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Projects,
      ProjectsSkills,
      ProjectsPositions,
      ProjectsComments,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
