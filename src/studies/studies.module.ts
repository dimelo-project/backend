import { StudiesComments } from './../entities/StudiesComments';
import { StudiesSkillsTags } from './../entities/StudiesSkillsTags';
import { Studies } from './../entities/Studies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { Users } from '../entities/Users';
import { StudiesSkills } from '../entities/StudiesSkills';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Studies,
      StudiesSkills,
      StudiesSkillsTags,
      StudiesComments,
    ]),
  ],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
