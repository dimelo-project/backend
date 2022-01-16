import { Likes } from './../entities/Likes';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Courses } from '../entities/Courses';
import { Repository } from 'typeorm';
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
  ) {}

  async findById(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['Instructor'],
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
}
