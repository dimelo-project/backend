import { ProjectsComments } from './../entities/ProjectsComments';
import { StudiesComments } from './../entities/StudiesComments';
import { TalksComments } from './../entities/TalksComments';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      TalksComments,
      StudiesComments,
      ProjectsComments,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
