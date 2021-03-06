import { CurrentUserDto } from './../common/dto/current-user.dto';
import { GetReviewsByInstructorDto } from './dto/get-reviews-by-instructor.dto';
import { GetReviewsByCourseDto } from './dto/get-reviews-by-course.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Courses } from './../entities/Courses';
import { ReviewHelpes } from './../entities/ReviewHelpes';
import { Reviews } from './../entities/Reviews';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { Instructors } from '../entities/Instructors';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ReviewHelpes)
    private readonly reviewHelpesRepository: Repository<ReviewHelpes>,
    @InjectRepository(Instructors)
    private readonly instructorsRepository: Repository<Instructors>,
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async createReview(
    courseId: number,
    { q1, q2, q3, q4, pros, cons }: CreateReviewDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    if (!user.nickname) {
      throw new ForbiddenException('프로필 설정을 먼저 해주세요');
    }
    const course = await this.coursesRepository.findOne({ id: courseId });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const myReview = await this.reviewsRepository.findOne({
      id: courseId,
      userId: user.id,
    });
    if (myReview) {
      throw new ForbiddenException('이미 해당 강의에 리뷰를 작성했습니다');
    }

    const review = new Reviews();
    review.userId = user.id;
    review.courseId = course.id;
    review.instructorId = course.instructorId;
    review.q1 = q1;
    review.q2 = q2;
    review.q3 = q3;
    review.q4 = q4;
    review.avg = +((q1 + q2 + q3 + q4) / 4).toFixed(1);
    review.pros = pros;
    review.cons = cons;

    return this.reviewsRepository.save(review);
  }

  async updateReview(
    courseId: number,
    id: number,
    { q1, q2, q3, q4, pros, cons }: UpdateReviewDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const course = await this.coursesRepository.findOne({ id: courseId });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const review = await this.reviewsRepository.findOne({ id });
    if (!review) {
      throw new NotFoundException('해당 리뷰가 존재하지 않습니다');
    }
    const myReview = await this.reviewsRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myReview) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }
    myReview.q1 = q1;
    myReview.q2 = q2;
    myReview.q3 = q3;
    myReview.q4 = q4;
    myReview.avg = +((q1 + q2 + q3 + q4) / 4).toFixed(1);
    myReview.pros = pros;
    myReview.cons = cons;

    return this.reviewsRepository.save(myReview);
  }

  async deleteReview(courseId: number, id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const course = await this.coursesRepository.findOne({ id: courseId });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const review = await this.reviewsRepository.findOne({ id });
    if (!review) {
      throw new NotFoundException('해당 리뷰가 존재하지 않습니다');
    }
    const myReview = await this.reviewsRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myReview) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }
    await this.reviewsRepository.delete({ id });
    return true;
  }

  async getReview(courseId: number, id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const course = await this.coursesRepository.findOne({ id: courseId });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    const review = await this.reviewsRepository.findOne({ id });
    if (!review) {
      throw new NotFoundException('해당 리뷰가 존재하지 않습니다');
    }
    const myReview = await this.reviewsRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myReview) {
      throw new ForbiddenException('권한이 없습니다');
    }
    return myReview;
  }

  async getCountByCourse(id: number) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    return this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.Course', 'course', 'course.id =:id', { id })
      .select('COUNT(review.id) AS num_review')
      .getRawOne();
  }

  async getByCourse(
    id: number,
    { perPage, page, sort, order }: GetReviewsByCourseDto,
    user?: CurrentUserDto,
  ) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }

    let sorting: string;
    switch (sort) {
      case 'avg':
        sorting = 'review.avg';
        break;
      case 'help':
        sorting = 'num_help';
        break;
      case 'date':
        sorting = 'review_createdAt';
        break;
      default:
        throw new BadRequestException('invalid sort value');
    }

    const Help = this.reviewHelpesRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'help.reviewId AS reviewId',
        'COUNT(help.reviewId) AS num_help',
        'help.userId AS userId',
      ])
      .from(ReviewHelpes, 'help')
      .groupBy('help.reviewId')
      .getQuery();

    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.Course', 'course', 'course.id =:id', { id })
      .innerJoin('review.User', 'user')
      .leftJoin(Help, 'help', 'help.reviewId = review.id')
      .select([
        'review.id',
        'review.pros',
        'review.cons',
        'review.avg',
        `DATE_FORMAT(review.createdAt, '%Y-%m-%d %H:%i') AS review_createdAt`,
        'user.id',
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl AS user_imageUrl',
        'IFNULL(help.num_help,0) AS num_help',
      ]);
    if (user) {
      query
        .leftJoin(
          ReviewHelpes,
          'helpme',
          'helpme.userId =:userId AND helpme.reviewId = review.id',
          { userId: user.id },
        )
        .addSelect(`IF(helpme.reviewId,'true','false') AS review_helped`);
    }
    const results = await query
      .orderBy(sorting, order)
      .limit(perPage)
      .offset(perPage * (page - 1))
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        review_createdAt: result.review_createdAt.split(' ')[0].toString(),
      };
    });
  }

  async getAverageOfCourse(id: number) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    return await this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.Course', 'course', 'course.id =:id', { id })
      .select([
        'ROUND(AVG(review.q1),1) AS q1',
        'ROUND(AVG(review.q2),1) AS q2',
        'ROUND(AVG(review.q3),1) AS q3',
        'ROUND(AVG(review.q4),1) AS q4',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .getRawOne();
  }

  async getCountByInstructor(id: number) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 하는 강사를 찾을 수 없습니다');
    }
    return this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.Instructor', 'instructor', 'instructor.id =:id', {
        id,
      })
      .select('COUNT(review.id) AS num_review')
      .getRawOne();
  }

  async getByInstructor(
    id: number,
    { perPage, page, sort, order }: GetReviewsByInstructorDto,
    user?: CurrentUserDto,
  ) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 하는 강사를 찾을 수 없습니다');
    }

    let sorting: string;
    switch (sort) {
      case 'avg':
        sorting = 'review.avg';
        break;
      case 'help':
        sorting = 'num_help';
        break;
      case 'date':
        sorting = 'review_createdAt';
        break;
      default:
        throw new BadRequestException('invalid sort value');
    }

    const Help = this.reviewHelpesRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'help.reviewId AS reviewId',
        'COUNT(help.reviewId) AS num_help',
        'help.userId AS userId',
      ])
      .from(ReviewHelpes, 'help')
      .groupBy('help.reviewId')
      .getQuery();

    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.Instructor', 'instructor', 'instructor.id =:id', {
        id,
      })
      .innerJoin('review.Course', 'course')
      .innerJoin('review.User', 'user')
      .leftJoin(Help, 'help', 'help.reviewId = review.id')
      .select([
        'course.id',
        'course.title',
        'review.id',
        'review.pros',
        'review.cons',
        'review.avg',
        `DATE_FORMAT(review.createdAt, '%Y-%m-%d %H:%i') AS review_createdAt`,
        'user.id',
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl AS user_imageUrl',
        'IFNULL(help.num_help,0) AS num_help',
      ]);

    if (user) {
      query
        .leftJoin(
          ReviewHelpes,
          'helpme',
          'helpme.userId =:userId AND helpme.reviewId = review.id',
          { userId: user.id },
        )
        .addSelect(`IF(helpme.reviewId,'true','false') AS review_helped`);
    }
    const results = await query
      .orderBy(sorting, order)
      .limit(perPage)
      .offset(perPage * (page - 1))
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        review_createdAt: result.review_createdAt.split(' ')[0].toString(),
      };
    });
  }

  async getAverageOfInstructor(id: number) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 하는 강사를 찾을 수 없습니다');
    }
    const avg = await this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.Instructor', 'instructor', 'instructor.id =:id', {
        id,
      })
      .select([
        'ROUND(AVG(review.q1),1) AS q1',
        'ROUND(AVG(review.q2),1) AS q2',
        'ROUND(AVG(review.q3),1) AS q3',
        'ROUND(AVG(review.q4),1) AS q4',
        'ROUND(AVG(review.avg),1) AS avg',
      ])
      .getRawOne();

    return {
      instructor_id: instructor.id,
      instructor_name: instructor.name,
      ...avg,
    };
  }

  async getMyReviews(userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .innerJoin('review.User', 'user', 'user.id =:id', { id: userId });

    const count = await query.getCount();

    const results = await query
      .innerJoin('review.Course', 'course')
      .select([
        'review.id',
        'review.pros',
        'review.cons',
        'review.avg',
        `DATE_FORMAT(review.createdAt, '%Y-%m-%d %H:%i') AS review_createdAt`,
        'course.id',
        'course.title',
      ])
      .orderBy('review_createdAt', 'DESC')
      .getRawMany();

    return {
      num_review: count,
      review: results.map((result) => {
        return {
          ...result,
          review_createdAt: result.review_createdAt.split(' ')[0].toString(),
        };
      }),
    };
  }

  async giveThumbsUp(id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const review = await this.reviewsRepository.findOne({
      id,
    });
    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다');
    }
    const helped = await this.reviewHelpesRepository.findOne({
      where: {
        reviewId: review.id,
        userId,
      },
    });
    if (helped) {
      throw new ForbiddenException('이미 도움됨을 눌렀습니다');
    }
    await this.reviewHelpesRepository.save({
      reviewId: review.id,
      userId: user.id,
    });
    return true;
  }

  async revokeThumbsUp(id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    const review = await this.reviewsRepository.findOne({
      id,
    });
    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다');
    }
    const helped = await this.reviewHelpesRepository.findOne({
      where: { reviewId: id, userId },
    });
    if (!helped) {
      throw new ForbiddenException('도움됨을 누른적이 없습니다');
    }
    await this.reviewHelpesRepository.remove(helped);
    return true;
  }
}
