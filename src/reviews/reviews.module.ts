import { Reviews } from './../entities/Reviews';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, Users])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
