import { Studies } from './../entities/Studies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { Users } from 'src/entities/Users';
import { StudiesSkills } from 'src/entities/StudiesSkills';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Studies, StudiesSkills])],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
