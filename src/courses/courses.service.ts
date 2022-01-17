import { CoursesCategories } from './../entities/CoursesCategories';
import { Categories } from './../entities/Categories';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesSkillsTags } from '../entities/CoursesSkillsTags';
import { CoursesSkills } from './../entities/CoursesSkills';
import { Likes } from './../entities/Likes';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Courses } from '../entities/Courses';
import { Connection, Repository } from 'typeorm';
import { Instructors } from '../entities/Instructors';
import { Users } from '../entities/Users';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Instructors)
    private readonly instructorsRepository: Repository<Instructors>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    @InjectRepository(CoursesSkills)
    private readonly coursesSkillsRepository: Repository<CoursesSkills>,
    private connection: Connection,
  ) {}

  async findById(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['Instructor', 'CoursesSkills'],
    });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    return course;
  }

  async addLike(id: number, userId: number) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    await this.likesRepository.save({
      courseId: course.id,
      userId: user.id,
    });
    return true;
  }

  async removeLike(id: number, userId: number) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const liked = await this.likesRepository.findOne({
      where: { courseId: id, userId },
    });
    if (liked) {
      await this.likesRepository.remove(liked);
    }
    return true;
  }

  async getLiked(myId: number) {
    const user = await this.usersRepository.findOne({ id: myId });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    return this.coursesRepository
      .createQueryBuilder('courses')
      .innerJoin('courses.Likes', 'likes', 'likes.userId =:myId', { myId })
      .innerJoinAndSelect('courses.Instructor', 'instructor')
      .getMany();
  }

  async findByInstructor(id: number) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 강사를 찾을 수 없습니다');
    }
    return this.coursesRepository.find({
      where: {
        instructorId: id,
      },
    });
  }

  async findBySkill(skill: string) {
    const foundSkill = await this.coursesSkillsRepository.findOne({ skill });
    if (!foundSkill) {
      throw new NotFoundException('해당하는 기술을 찾을 수 없습니다');
    }
    return this.coursesRepository
      .createQueryBuilder('courses')
      .innerJoin('courses.CoursesSkills', 'skills', 'skills.skill =:skill', {
        skill,
      })
      .innerJoinAndSelect('courses.Instructor', 'instructor')
      .getMany();
  }

  async createCourse({
    title,
    platform,
    categoryBig,
    categories,
    siteUrl,
    price,
    skills,
    instructor,
  }: CreateCourseDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let returnedInstructor = await queryRunner.manager
        .getRepository(Instructors)
        .findOne({ name: instructor });
      if (!returnedInstructor) {
        returnedInstructor = await queryRunner.manager
          .getRepository(Instructors)
          .save({ name: instructor });
      }

      const categoriesId = await Promise.all(
        categories.map(async (category: string): Promise<number> => {
          let returnedCategory = await queryRunner.manager
            .getRepository(Categories)
            .findOne({ category });
          if (!returnedCategory) {
            returnedCategory = await queryRunner.manager
              .getRepository(Categories)
              .save({ category });
          }
          return returnedCategory.id;
        }),
      );

      const skillsId = await Promise.all(
        skills.map(async (skill: string): Promise<number> => {
          let returnedSkill = await queryRunner.manager
            .getRepository(CoursesSkills)
            .findOne({ skill });
          if (!returnedSkill) {
            returnedSkill = await queryRunner.manager
              .getRepository(CoursesSkills)
              .save({ skill });
          }
          return returnedSkill.id;
        }),
      );

      const newCourse = new Courses();
      newCourse.title = title;
      newCourse.platform = platform;
      newCourse.categoryBig = categoryBig;
      newCourse.siteUrl = siteUrl;
      newCourse.price = price;
      newCourse.instructorId = returnedInstructor.id;

      const returnedCourse = await queryRunner.manager
        .getRepository(Courses)
        .save(newCourse);

      await Promise.all(
        categoriesId.map(async (categoryId: number): Promise<void> => {
          const courseCategory = new CoursesCategories();
          courseCategory.courseId = returnedCourse.id;
          courseCategory.categoryId = categoryId;
          await queryRunner.manager
            .getRepository(CoursesCategories)
            .save(courseCategory);
        }),
      );

      await Promise.all(
        skillsId.map(async (skillId: number): Promise<void> => {
          const skillTag = new CoursesSkillsTags();
          skillTag.courseId = returnedCourse.id;
          skillTag.skillId = skillId;
          await queryRunner.manager
            .getRepository(CoursesSkillsTags)
            .save(skillTag);
        }),
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
