import { CreateReviewWithCourseDto } from './../reviews/dto/create-review-with-course.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async sendReview(
    userId: number,
    { siteUrl, q1, q2, q3, q4, pros, cons }: CreateReviewWithCourseDto,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 해주세요');
    }
    try {
      await this.mailerService.sendMail({
        to: process.env.NODEMAILER_USER,
        from: 'Dimelo Team',
        subject: '강의 신청 및 리뷰',
        html: `
        <p>${userId}: ${user.nickname}</p>
        <p>강의 사이트: ${siteUrl}</p>
        <p>점수: ${q1}, ${q2}, ${q3}, ${q4}</p>
        <p>장점: ${pros}</p>
        <p>단점: ${cons}</p>
      `,
      });
    } catch (err) {
      throw new ConflictException('다시 시도 해주세요');
    }
    return true;
  }

  async sendPassword(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    const password = generator.generate({ length: 10, numbers: true });
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'Dimelo Team',
        subject: '<Dimelo> 임시 비밀번호 발급',
        html: `
        <p>임시 비밀번호 입니다. 해당 비밀번호로 로그인 후 비밀번호를 변경해주세요 : ${password}</p>`,
      });

      await this.usersRepository.save({
        ...user,
        password: hashedPassword,
      });
      return true;
    } catch (err) {
      throw new ConflictException('다시 시도 해주세요');
    }
  }
}
