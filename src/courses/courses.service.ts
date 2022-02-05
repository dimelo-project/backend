import { Reviews } from './../entities/Reviews';
import { GetCountCoursesDto } from './dto/get-count-courses.dto';
import { GetSkillsFromCategoryDto } from './dto/get-skills-from-category.dto';
import { GetCoursesFromAllDto } from './dto/get-courses-from-all.dto';
import { CoursesCategories } from './../entities/CoursesCategories';
import { Categories } from './../entities/Categories';
import { GetCoursesFromCategoryDto } from './dto/get-courses-from-category.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesSkillsTags } from '../entities/CoursesSkillsTags';
import { CoursesSkills } from './../entities/CoursesSkills';
import { Likes } from './../entities/Likes';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
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
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
    private connection: Connection,
  ) {}

  async getFromCategory({
    categoryBig,
    category,
    perPage,
    page,
    skill,
    sort,
  }: GetCoursesFromCategoryDto) {
    if (!categoryBig || !category) {
      throw new BadRequestException('카테고리를 선택해 주세요');
    }
    const query = this.coursesRepository.createQueryBuilder('course');

    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    query
      .where('course.categoryBig =:categoryBig', { categoryBig })
      .innerJoin('course.Instructor', 'instructor')
      .innerJoin(
        'course.Categories',
        'category',
        'category.category =:category',
        { category },
      );
    if (skill) {
      query.innerJoin(
        'course.CoursesSkills',
        'skills',
        'skills.skill =:skill',
        {
          skill,
        },
      );
    }

    query
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.categoryBig AS course_categoryBig',
        'category.category AS course_category',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
      ]);

    if (skill) {
      query.addSelect('skills.skill AS course_skill');
    }

    return query
      .orderBy(`${sort === 'avg' ? 'course_avg' : 'num_review'}`, 'DESC')
      .limit(perPage)
      .offset(perPage * (page - 1))
      .getRawMany();
  }

  async getCountFromCategory({
    categoryBig,
    category,
    skill,
  }: GetCountCoursesDto) {
    if (!categoryBig || !category) {
      throw new BadRequestException('카테고리를 선택해 주세요');
    }
    const query = this.coursesRepository.createQueryBuilder('course');
    query
      .where('course.categoryBig =:categoryBig', { categoryBig })
      .innerJoin(
        'course.Categories',
        'category',
        'category.category =:category',
        { category },
      );

    if (skill) {
      query.innerJoin(
        'course.CoursesSkills',
        'skills',
        'skills.skill =:skill',
        {
          skill,
        },
      );
    }
    return query.select('COUNT(course.id) AS num_course').getRawOne();
  }

  async getSkillsFromCategory({
    categoryBig,
    category,
  }: GetSkillsFromCategoryDto) {
    if (!categoryBig || !category) {
      throw new BadRequestException('카테고리를 선택해 주세요');
    }
    return this.coursesSkillsRepository
      .createQueryBuilder('skill')
      .innerJoin('skill.Courses', 'course')
      .where('course.categoryBig =:categoryBig', { categoryBig })
      .innerJoin(
        'course.Categories',
        'category',
        'category.category =:category',
        { category },
      )
      .select(['skill.id', 'skill.skill', 'COUNT(course.id) AS num_course'])
      .groupBy('skill.id')
      .orderBy('num_course', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async searchFromAll(
    { perPage, page, sort }: GetCoursesFromAllDto,
    keyword: string,
  ) {
    if (!keyword) {
      throw new BadRequestException('키워드를 입력해주세요');
    }

    const query = this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.Instructor', 'instructor')
      .andWhere(
        '(course.title LIKE :keyword OR instructor.name LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    const result = await query.getMany();

    if (result.length === 0) {
      throw new NotFoundException('해당 하는 강의를 찾을 수 없습니다');
    }

    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'IFNULL(ROUND(AVG(review.avg),1),0) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    return query
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
      ])
      .limit(perPage)
      .offset(perPage * (page - 1))
      .orderBy(`${sort === 'avg' ? 'course_avg' : 'num_review'}`, 'DESC')
      .getRawMany();
  }

  async getCountBySearchFromAll(keyword: string) {
    if (!keyword) {
      throw new BadRequestException('키워드를 입력해주세요');
    }
    return this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.Instructor', 'instructor')
      .andWhere(
        '(course.title LIKE :keyword OR instructor.name LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      )
      .select('COUNT(course.id) AS num_course')
      .getRawOne();
  }

  async searchFromCategory(
    {
      categoryBig,
      category,
      skill,
      perPage,
      page,
      sort,
    }: GetCoursesFromCategoryDto,
    keyword: string,
  ) {
    if (!categoryBig || !category) {
      throw new BadRequestException('카테고리를 선택해 주세요');
    }
    if (!keyword) {
      throw new BadRequestException('키워드를 입력해주세요');
    }
    const query = this.coursesRepository
      .createQueryBuilder('course')
      .where('course.categoryBig =:categoryBig', { categoryBig })
      .innerJoin(
        'course.Categories',
        'category',
        'category.category =:category',
        { category },
      )
      .innerJoin('course.Instructor', 'instructor')
      .andWhere(
        '(course.title LIKE :keyword OR instructor.name LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );

    if (skill) {
      query
        .innerJoin('course.CoursesSkills', 'skills', 'skills.skill =:skill', {
          skill,
        })
        .andWhere(
          '(course.title LIKE :keyword OR instructor.name LIKE :keyword)',
          {
            keyword: `%${keyword}%`,
          },
        );
    }

    const result = await query.getMany();

    if (result.length === 0) {
      throw new NotFoundException('해당 하는 강의를 찾을 수 없습니다');
    }

    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    query
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.categoryBig AS course_categoryBig',
        'category.category AS course_category',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
      ]);

    if (skill) {
      query.addSelect('skills.skill AS course_skill');
    }

    return query
      .limit(perPage)
      .offset(perPage * (page - 1))
      .orderBy(`${sort === 'avg' ? 'course_avg' : 'num_review'}`, 'DESC')
      .getRawMany();
  }

  async getCountBySearchFromCategory(
    { categoryBig, category, skill }: GetCountCoursesDto,
    keyword: string,
  ) {
    if (!categoryBig || !category) {
      throw new BadRequestException('카테고리를 선택해 주세요');
    }
    if (!keyword) {
      throw new BadRequestException('키워드를 입력해주세요');
    }
    const query = this.coursesRepository
      .createQueryBuilder('course')
      .where('course.categoryBig =:categoryBig', { categoryBig })
      .innerJoin(
        'course.Categories',
        'category',
        'category.category =:category',
        { category },
      )
      .innerJoin('course.Instructor', 'instructor')
      .andWhere(
        '(course.title LIKE :keyword OR instructor.name LIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );

    if (skill) {
      query
        .innerJoin('course.CoursesSkills', 'skills', 'skills.skill =:skill', {
          skill,
        })
        .andWhere(
          '(course.title LIKE :keyword OR instructor.name LIKE :keyword)',
          {
            keyword: `%${keyword}%`,
          },
        );
    }

    return query.select('COUNT(course.id) AS num_course').getRawOne();
  }

  async findById(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }

    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    return this.coursesRepository
      .createQueryBuilder('course')
      .where('course.id =:id', { id })
      .innerJoin('course.Instructor', 'instructor')
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
      ])
      .getRawOne();
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
    const liked = await this.likesRepository.findOne({
      courseId: course.id,
      userId: user.id,
    });

    if (liked) {
      throw new UnauthorizedException('이미 북마크했습니다');
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
    if (!liked) {
      throw new UnauthorizedException('북마크 한적이 없습니다');
    }
    await this.likesRepository.remove(liked);
    return true;
  }

  async checkIfIliked(id: number, myId: number) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const user = await this.usersRepository.findOne({ id: myId });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const liked = await this.likesRepository.findOne({
      where: { courseId: id, userId: user.id },
    });
    if (!liked) {
      return false;
    }
    return true;
  }

  async getLiked(myId: number) {
    const user = await this.usersRepository.findOne({ id: myId });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    return this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.Likes', 'likes', 'likes.userId =:myId', { myId })
      .innerJoin('course.Instructor', 'instructor')
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
        `DATE_FORMAT(likes.createdAt, '%Y-%m-%d') AS like_date`,
      ])
      .orderBy('like_date', 'DESC')
      .getRawMany();
  }

  async getCountByInstructor(id: number) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 강사를 찾을 수 없습니다');
    }
    return this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.Instructor', 'instructor', 'instructor.id =:id', {
        id,
      })
      .select('COUNT(course.id) AS num_course')
      .getRawOne();
  }

  async findByInstructor(
    id: number,
    { perPage, page, sort }: GetCoursesFromAllDto,
  ) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 강사를 찾을 수 없습니다');
    }
    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    return this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.Instructor', 'instructor', 'instructor.id =:id', {
        id,
      })
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
      ])
      .limit(perPage)
      .offset(perPage * (page - 1))
      .orderBy(`${sort === 'avg' ? 'course_avg' : 'num_review'}`, 'DESC')
      .getRawMany();
  }

  async getCountBySkill(id: number) {
    const foundSkill = await this.coursesSkillsRepository.findOne({ id });
    if (!foundSkill) {
      throw new NotFoundException('해당하는 기술을 찾을 수 없습니다');
    }
    return this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.CoursesSkills', 'skill', 'skill.id =:id', {
        id,
      })
      .select('COUNT(course.id) AS num_course')
      .getRawOne();
  }

  async findBySkill(id: number, { perPage, page, sort }: GetCoursesFromAllDto) {
    const foundSkill = await this.coursesSkillsRepository.findOne({ id });
    if (!foundSkill) {
      throw new NotFoundException('해당하는 기술을 찾을 수 없습니다');
    }
    const Review = this.reviewsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'review.courseId AS courseId',
        'COUNT(review.id) AS num_review',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .from(Reviews, 'review')
      .groupBy('review.courseId')
      .getQuery();

    return this.coursesRepository
      .createQueryBuilder('course')
      .innerJoin('course.CoursesSkills', 'skill', 'skill.id =:id', {
        id,
      })
      .innerJoin('course.Instructor', 'instructor')
      .leftJoin(Review, 'review', 'review.courseId = course.id')
      .select([
        'course.id',
        'course.title',
        'course.platform',
        'course.price',
        'course.siteUrl AS course_siteUrl',
        `DATE_FORMAT(course.createdAt, '%Y-%m-%d') AS course_createdAt`,
        'instructor.id',
        'instructor.name',
        'IFNULL(review.num_review,0) AS num_review',
        'IFNULL(review.avg,0) AS course_avg',
      ])
      .limit(perPage)
      .offset(perPage * (page - 1))
      .orderBy(`${sort === 'avg' ? 'course_avg' : 'num_review'}`, 'DESC')
      .getRawMany();
  }

  async getCourseSkills() {
    return this.coursesSkillsRepository
      .createQueryBuilder('skill')
      .innerJoin('skill.CoursesSkillsTgas', 'tag')
      .select(['skill.id', 'skill.skill', 'COUNT(tag.course_id) AS num_course'])
      .groupBy('tag.skill_id')
      .orderBy('num_course', 'DESC')
      .limit(7)
      .getRawMany();
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
    const course = await this.coursesRepository.findOne({
      title,
      categoryBig,
    });
    if (course) {
      throw new ConflictException('해당 강의가 이미 존재합니다');
    }
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
            throw new BadRequestException('해당 카테고리가 존재하지 않습니다');
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
      return returnedCourse;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
