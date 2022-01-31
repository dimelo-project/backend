import { ProjectsComments } from './entities/ProjectsComments';
import { ProjectsSkillsTags } from './entities/ProjectsSkillsTags';
import { ProjectsSkills } from './entities/ProjectsSkills';
import { ProjectsPositionsTags } from './entities/ProjectsPositionsTags';
import { ProjectsPositions } from './entities/ProjectsPositions';
import { Projects } from './entities/Projects';
import { StudiesComments } from './entities/StudiesComments';
import { StudiesSkillsTags } from './entities/StudiesSkillsTags';
import { StudiesSkills } from './entities/StudiesSkills';
import { Studies } from './entities/Studies';
import { TalksComments } from './entities/TalksComments';
import { Talks } from './entities/Talks';
import { ReviewHelpes } from './entities/ReviewHelpes';
import { Reviews } from './entities/Reviews';
import { Likes } from './entities/Likes';
import { Instructors } from './entities/Instructors';
import { CoursesSkillsTags } from './entities/CoursesSkillsTags';
import { CoursesSkills } from './entities/CoursesSkills';
import { CoursesCategories } from './entities/CoursesCategories';
import { Categories } from './entities/Categories';
import { Courses } from './entities/Courses';
import { Users } from './entities/Users';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TalksModule } from './talks/talks.module';
import { StudiesModule } from './studies/studies.module';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ImagesModule } from './images/images.module';
import { MailModule } from './mail/mail.module';
import { configValidationSchema } from './config.schema';
import { ThrottlerAsyncOptions, ThrottlerModule } from '@nestjs/throttler';

const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [
      Users,
      Courses,
      Categories,
      CoursesCategories,
      CoursesSkills,
      CoursesSkillsTags,
      Instructors,
      Likes,
      Reviews,
      ReviewHelpes,
      Talks,
      TalksComments,
      Studies,
      StudiesSkills,
      StudiesSkillsTags,
      StudiesComments,
      Projects,
      ProjectsPositions,
      ProjectsPositionsTags,
      ProjectsSkills,
      ProjectsSkillsTags,
      ProjectsComments,
    ],
    migrations: [__dirname + '/src/migrations/*.ts'],
    cli: { migrationsDir: 'src/migrations' },
    autoLoadEntities: false,
    charset: 'utf8mb4',
    synchronize: false,
    logging: true,
    keepConnectionAlive: true,
    namingStrategy: new SnakeNamingStrategy(),
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL'),
        limit: config.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    ReviewsModule,
    TalksModule,
    StudiesModule,
    ProjectsModule,
    ImagesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
