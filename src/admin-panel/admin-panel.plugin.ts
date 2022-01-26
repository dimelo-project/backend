import { CategoriesResource } from './resources/categories.resource';
import { ReviewsResource } from './resources/reviews.resource';
import { ProjectsCommentsResource } from './resources/projects-comments.resource';
import { ProjectsPositionsResource } from './resources/projects-positions.resource';
import { ProjectsSkillsResource } from './resources/projects-skills.resource';
import { ProjectsResource } from './resources/projects.resource';
import { StudiesCommentsResource } from './resources/studies-comments.resource';
import { StudiesSkillsResource } from './resources/studies-skills.resource';
import { StudiesResource } from './resources/studies.resource';
import { TalksCommentsResource } from './resources/talks-comments.resource';
import { TalksResource } from './resources/talks.resource';
import { InstructorsResource } from './resources/instructors.resource';
import { CoursesSkillResource } from './resources/courses-skills.resource';
import { CoursesResource } from './resources/course.resource';
import { UsersResource } from './resources/users.resource';
import { INestApplication } from '@nestjs/common';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import AdminJSExpress from '@adminjs/express';
import { validate } from 'class-validator';

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  Resource.validate = validate;
  AdminJS.registerAdapter({ Database, Resource });

  const adminJS = new AdminJS({
    resources: [
      UsersResource,
      CoursesResource,
      CategoriesResource,
      CoursesSkillResource,
      InstructorsResource,
      ReviewsResource,
      TalksResource,
      TalksCommentsResource,
      StudiesResource,
      StudiesSkillsResource,
      StudiesCommentsResource,
      ProjectsResource,
      ProjectsSkillsResource,
      ProjectsPositionsResource,
      ProjectsCommentsResource,
    ],
    rootPath: '/admin',
  });

  const router = AdminJSExpress.buildRouter(adminJS);

  app.use(adminJS.options.rootPath, router);
}
