import { CreateUserDto } from './dto/create-user.dto';
import { GithubLoginUserDto } from './dto/github-login-user.dto';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { GoogleLoginUserDto } from './dto/google-login-user.dto';
import generator from 'generate-password';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly mailerService: MailerService,
  ) {}
  async createUser(email: string, password: string, passwordConfirm: string) {
    const foundEmail = await this.usersRepository.findOne({ where: { email } });
    if (foundEmail) {
      throw new ConflictException('이미 해당하는 아이디가 존재합니다');
    }
    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    return this.usersRepository.save({
      email,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
    });
    if (!user) {
      return null;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async googleSignUp(user: GoogleLoginUserDto) {
    const foundGoogle = await this.usersRepository.findOne({
      where: { email: user.email, googleId: user.googleId },
    });
    if (foundGoogle) {
      return foundGoogle;
    }
    const found = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (found) {
      const googleConnected = {
        ...found,
        googleId: user.googleId,
      };
      return this.usersRepository.save(googleConnected);
    }
    return this.usersRepository.save(user);
  }

  async githubSignUp(user: GithubLoginUserDto) {
    const foundGithub = await this.usersRepository.findOne({
      where: { email: user.email, githubId: user.githubId },
    });
    if (foundGithub) {
      return foundGithub;
    }
    const found = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (found) {
      const githubConnected = {
        ...found,
        githubId: user.githubId,
      };
      return this.usersRepository.save(githubConnected);
    }
    return this.usersRepository.save(user);
  }

  async checkEmail(email: string) {
    const foundEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (foundEmail) {
      throw new ConflictException('이미 해당하는 아이디가 존재합니다');
    }
    return true;
  }

  async checkNickname(nickname: string) {
    const foundNick = await this.usersRepository.findOne({
      where: { nickname },
    });
    if (foundNick) {
      throw new ConflictException('이미 해당하는 닉네임이 존재합니다');
    }
    return true;
  }

  async sendMail(email: string) {
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
        html: `임시 비밀번호 입니다. 해당 비밀번호로 로그인 후 비밀번호를 변경해주세요 : ${password}`,
      });

      await this.usersRepository.save({
        ...user,
        password: hashedPassword,
      });
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
