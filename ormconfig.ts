import dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProjectsComments } from './src/entities/ProjectsComments';
import { ProjectsSkills } from './src/entities/ProjectsSkills';
import { StudiesComments } from './src/entities/StudiesComments';
import { ProjectsPositions } from './src/entities/ProjectsPositions';
import { Projects } from './src/entities/Projects';
import { StudiesSkills } from './src/entities/StudiesSkills';
import { Studies } from './src/entities/Studies';
import { Likes } from './src/entities/Likes';
import { TalksComments } from './src/entities/TalksComments';
import { Talks } from './src/entities/Talks';
import { Reviews } from './src/entities/Reviews';
import { Instructors } from './src/entities/Instructors';
import { CoursesSkills } from './src/entities/CoursesSkills';
import { Courses } from './src/entities/Courses';
import { Users } from './src/entities/Users';

const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Users,
    Courses,
    CoursesSkills,
    Instructors,
    Likes,
    Reviews,
    Talks,
    TalksComments,
    Studies,
    StudiesSkills,
    StudiesComments,
    Projects,
    ProjectsPositions,
    ProjectsSkills,
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
};

export = config;
