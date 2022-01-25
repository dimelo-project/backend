import { Projects } from './../entities/Projects';
import { Users } from './../entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Projects])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
