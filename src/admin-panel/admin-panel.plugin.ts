import { CategoriesResource } from './resources/categories.resource';
import { ReviewsResource } from './resources/reviews.resource';
import { ProjectsPositionsTagsResource } from './resources/projects-positions-tags.resource';
import { ProjectsSkillsTagsResource } from './resources/projects-skills-tags.resource';
import { ProjectsCommentsResource } from './resources/projects-comments.resource';
import { ProjectsPositionsResource } from './resources/projects-positions.resource';
import { ProjectsSkillsResource } from './resources/projects-skills.resource';
import { ProjectsResource } from './resources/projects.resource';
import { StudiesCommentsResource } from './resources/studies-comments.resource';
import { StudiesSkillsTagsResource } from './resources/studies-skills-tags.resource';
import { StudiesSkillsResource } from './resources/studies-skills.resource';
import { StudiesResource } from './resources/studies.resource';
import { TalksCommentsResource } from './resources/talks-comments.resource';
import { TalksResource } from './resources/talks.resource';
import { ReviewHelpesResource } from './resources/review-helpes.resource';
import { LikesResource } from './resources/likes.resource';
import { InstructorsResource } from './resources/instructors.resource';
import { CoursesSkillsTagsResource } from './resources/courses-skills-tags.resource';
import { CoursesSkillResource } from './resources/courses-skills.resource';
import { CoursesResource } from './resources/course.resource';
import { UsersResource } from './resources/users.resource';
import { INestApplication } from '@nestjs/common';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import AdminJSExpress from '@adminjs/express';
import { validate } from 'class-validator';
import { CoursesCategoriesResource } from './resources/courses-categires.resource';

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  Resource.validate = validate;
  AdminJS.registerAdapter({ Database, Resource });

  const adminJS = new AdminJS({
    resources: [
      UsersResource,
      CoursesResource,
      CategoriesResource,
      CoursesCategoriesResource,
      CoursesSkillResource,
      CoursesSkillsTagsResource,
      InstructorsResource,
      LikesResource,
      ReviewsResource,
      ReviewHelpesResource,
      TalksResource,
      TalksCommentsResource,
      StudiesResource,
      StudiesSkillsResource,
      StudiesSkillsTagsResource,
      StudiesCommentsResource,
      ProjectsResource,
      ProjectsSkillsResource,
      ProjectsSkillsTagsResource,
      ProjectsPositionsResource,
      ProjectsPositionsTagsResource,
      ProjectsCommentsResource,
    ],
    rootPath: '/admin',
  });

  const router = AdminJSExpress.buildRouter(adminJS);

  app.use(adminJS.options.rootPath, router);
}
