import { CreateReviewDto } from './dto/create-review.dto';
import { Courses } from './../entities/Courses';
import { ReviewHelpes } from './../entities/ReviewHelpes';
import { Reviews } from './../entities/Reviews';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
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

  async writeReview(
    courseId: number,
    { q1, q2, q3, q4, pros, cons }: CreateReviewDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    if (!user.nickname) {
      throw new UnauthorizedException('프로필을 설정 해주세요');
    }
    const course = await this.coursesRepository.findOne({ id: courseId });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }

    const review = new Reviews();
    review.userId = user.id;
    review.courseId = course.id;
    review.instructorId = course.instructorId;
    review.q1 = q1;
    review.q2 = q2;
    review.q3 = q3;
    review.q4 = q4;
    review.avg = (q1 + q2 + q3 + q4) / 4;
    review.pros = pros;
    review.cons = cons;

    return this.reviewsRepository.save(review);
  }

  async getReviewsByCourse(id: number) {
    const course = await this.coursesRepository.findOne({ id });
    if (!course) {
      throw new NotFoundException('해당 강의를 찾을 수 없습니다');
    }
    return this.reviewsRepository
      .createQueryBuilder('reviews')
      .innerJoin('reviews.Course', 'course', 'course.id =:id', { id })
      .innerJoin('reviews.User', 'user')
      .select([
        'reviews.id',
        'reviews.pros',
        'reviews.cons',
        'reviews.avg',
        'reviews.createdAt',
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl',
      ])
      .getMany();
  }

  async getReviewsByInstructor(id: number) {
    const instructor = await this.instructorsRepository.findOne({ id });
    if (!instructor) {
      throw new NotFoundException('해당 하는 강사를 찾을 수 없습니다');
    }
    return this.reviewsRepository
      .createQueryBuilder('reviews')
      .innerJoin('reviews.Instructor', 'instructor', 'instructor.id =:id', {
        id,
      })
      .innerJoin('reviews.User', 'user')
      .select([
        'reviews.id',
        'reviews.pros',
        'reviews.cons',
        'reviews.avg',
        'reviews.createdAt',
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl',
      ])
      .getMany();
  }

  async getMyReviews(userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    return this.reviewsRepository
      .createQueryBuilder('reviews')
      .innerJoin('reviews.User', 'user', 'user.id =:id', { id: userId })
      .innerJoin('reviews.Course', 'course')
      .innerJoin('reviews.Instructor', 'instructor')
      .select([
        'reviews.id',
        'reviews.pros',
        'reviews.cons',
        'reviews.avg',
        'reviews.createdAt',
        'instructor.name',
        'course.title',
        'course.platform',
      ])
      .getMany();
  }

  async giveThumbsUp(id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
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
      throw new ConflictException('이미 도움됨을 눌렀습니다');
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
      throw new ConflictException('도움됨을 누른적이 없습니다');
    }
    await this.reviewHelpesRepository.remove(helped);
    return true;
  }

  async checkIgaveThumbsUp(id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
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
      return false;
    }
    return true;
  }

  async checkThumbsUpCount(id: number) {
    const review = await this.reviewsRepository.findOne({
      id,
    });
    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다');
    }
    return this.reviewHelpesRepository
      .createQueryBuilder('help')
      .innerJoin('help.Review', 'review', 'review.id =:id', { id })
      .getCount();
  }
}
