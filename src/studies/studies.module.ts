import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService]
})
export class StudiesModule {}
