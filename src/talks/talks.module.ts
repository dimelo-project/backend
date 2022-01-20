import { TalksComments } from './../entities/TalksComments';
import { Talks } from './../entities/Talks';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TalksController } from './talks.controller';
import { TalksService } from './talks.service';
import { Users } from '../entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Talks, TalksComments, Users])],
  controllers: [TalksController],
  providers: [TalksService],
})
export class TalksModule {}
