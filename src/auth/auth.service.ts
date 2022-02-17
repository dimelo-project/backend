import { GithubLoginUserDto } from './dto/github-login-user.dto';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { GoogleLoginUserDto } from './dto/google-login-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}
  async createUser(email: string, password: string, passwordConfirm: string) {
    const foundEmail = await this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (foundEmail) {
      throw new ConflictException('이미 해당하는 아이디가 존재합니다');
    }
    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
    );

    return this.usersRepository.save({
      email,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname', 'imageUrl'],
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
      withDeleted: true,
    });

    if (foundGoogle && foundGoogle.deletedAt) {
      foundGoogle.deletedAt = null;
      const { id, email, nickname, imageUrl } = await this.usersRepository.save(
        foundGoogle,
      );
      return { id, email, nickname, imageUrl };
    }

    if (foundGoogle) {
      return {
        id: foundGoogle.id,
        email: foundGoogle.email,
        nickname: foundGoogle.nickname,
        imageUrl: foundGoogle.imageUrl,
      };
    }

    const found = await this.usersRepository.findOne({
      where: { email: user.email },
      withDeleted: true,
    });

    if (found && found.deletedAt) {
      found.deletedAt = null;
      found.googleId = user.googleId;
      const { id, email, nickname, imageUrl } = await this.usersRepository.save(
        found,
      );
      return { id, email, nickname, imageUrl };
    }

    if (found) {
      found.googleId = user.googleId;
      const { id, email, nickname, imageUrl } = await this.usersRepository.save(
        found,
      );
      return {
        id,
        email,
        nickname,
        imageUrl,
      };
    }

    const { id, email, nickname, imageUrl } = await this.usersRepository.save(
      user,
    );
    return { id, email, nickname, imageUrl };
  }

  async githubSignUp(user: GithubLoginUserDto) {
    const foundGithub = await this.usersRepository.findOne({
      where: { email: user.email, githubId: user.githubId },
      withDeleted: true,
    });

    if (foundGithub && foundGithub.deletedAt) {
      foundGithub.deletedAt = null;
      const { id, email, nickname, imageUrl } = await this.usersRepository.save(
        foundGithub,
      );
      return { id, email, nickname, imageUrl };
    }

    if (foundGithub) {
      return {
        id: foundGithub.id,
        email: foundGithub.email,
        nickname: foundGithub.nickname,
        imageUrl: foundGithub.imageUrl,
      };
    }

    const found = await this.usersRepository.findOne({
      where: { email: user.email },
      withDeleted: true,
    });

    if (found && found.deletedAt) {
      found.deletedAt = null;
      found.githubId = user.githubId;
      const { id, email, nickname, imageUrl } = await this.usersRepository.save(
        found,
      );
      return {
        id,
        email,
        nickname,
        imageUrl,
      };
    }

    if (found) {
      found.githubId = user.githubId;
      const { id, email, nickname, imageUrl } = await this.usersRepository.save(
        found,
      );
      return {
        id,
        email,
        nickname,
        imageUrl,
      };
    }
    const { id, email, nickname, imageUrl } = await this.usersRepository.save(
      user,
    );
    return { id, email, nickname, imageUrl };
  }

  async checkEmail(email: string) {
    const foundEmail = await this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (foundEmail) {
      throw new ConflictException('이미 해당하는 아이디가 존재합니다');
    }
    return true;
  }
}
