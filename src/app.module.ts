import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TalksModule } from './talks/talks.module';
import { StudiesModule } from './studies/studies.module';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from './images/images.module';
import ormconfig from '../ormconfig';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    CoursesModule,
    ReviewsModule,
    TalksModule,
    StudiesModule,
    ProjectsModule,
    TypeOrmModule.forRoot(ormconfig),
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
