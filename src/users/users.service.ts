import { ProjectsComments } from './../entities/ProjectsComments';
import { StudiesComments } from './../entities/StudiesComments';
import { TalksComments } from './../entities/TalksComments';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user-profile.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(TalksComments)
    private readonly talksCommentsRepository: Repository<TalksComments>,
    @InjectRepository(StudiesComments)
    private readonly studiesCommentsRepository: Repository<StudiesComments>,
    @InjectRepository(ProjectsComments)
    private readonly projectsCommentsRepository: Repository<ProjectsComments>,
    private readonly configService: ConfigService,
  ) {}

  async getMyInfo(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    return user;
  }

  async checkNickname(nickname: string, id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (user.nickname !== nickname) {
      const foundNick = await this.usersRepository.findOne({
        where: { nickname },
      });
      if (foundNick) {
        throw new ConflictException('해당 닉네임은 이미 사용중 입니다');
      }
    }
    return true;
  }

  async createProfile(
    id: number,
    data: CreateUserProfileDto,
    file?: Express.MulterS3.File,
  ) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (user.nickname) {
      throw new ForbiddenException('이미 프로필을 생성하였습니다');
    }
    const foundNick = await this.usersRepository.findOne({
      where: { nickname: data.nickname },
    });
    if (foundNick) {
      throw new ConflictException('해당 닉네임은 이미 사용중 입니다');
    }
    if (file) {
      user.imageUrl = file.location;
    }
    const updatedUser = {
      ...user,
      ...data,
    };
    return this.usersRepository.save(updatedUser);
  }

  async updateProfile(
    id: number,
    data: UpdateUserDto,
    file?: Express.MulterS3.File,
  ) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }

    if (user.nickname !== data.nickname) {
      const foundNick = await this.usersRepository.findOne({
        where: { nickname: data.nickname },
      });
      if (foundNick) {
        throw new ConflictException('해당 닉네임은 이미 사용중 입니다');
      }
    }
    if (file) {
      data.imageUrl = file.location;
    }
    const updatedUser = {
      ...user,
      ...data,
    };
    return this.usersRepository.save(updatedUser);
  }

  async delete(id: number, password: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }
    await this.usersRepository.softDelete({ id: user.id });
    return true;
  }

  async setPassword(id: number, newPassword: string, passwordConfirm: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (user.password) {
      throw new ForbiddenException('비밀번호가 이미 설정되어 있습니다');
    }
    if (newPassword !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
    );

    await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
    return true;
  }

  async changePassword(
    id: number,
    password: string,
    newPassword: string,
    passwordConfirm: string,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }
    if (password === newPassword) {
      throw new ConflictException('같은 비밀번호를 설정할 수 없습니다');
    }
    if (newPassword !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );
    await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
    return true;
  }

  async checkPassword(id: number, password: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }
    return true;
  }

  async getMyComments(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }

    const talk = await this.talksCommentsRepository
      .createQueryBuilder('comment')
      .where('comment.userId =:id', { id })
      .innerJoin('comment.Talk', 'talk', 'talk.id = comment.talkId')
      .select([
        'talk.id',
        'talk.title AS title',
        'comment.id AS comment_id',
        'comment.commentText AS comment_commentText',
        `DATE_FORMAT(comment.updatedAt, '%Y.%m.%d') AS comment_updatedAt`,
      ])
      .getRawMany();

    const study = await this.studiesCommentsRepository
      .createQueryBuilder('comment')
      .where('comment.userId =:id', { id })
      .innerJoin('comment.Study', 'study', 'study.id = comment.studyId')
      .select([
        'study.id',
        'study.title AS title',
        'comment.id AS comment_id',
        'comment.commentText AS comment_commentText',
        `DATE_FORMAT(comment.updatedAt, '%Y.%m.%d') AS comment_updatedAt`,
      ])
      .getRawMany();

    const project = await this.projectsCommentsRepository
      .createQueryBuilder('comment')
      .where('comment.userId =:id', { id })
      .innerJoin('comment.Project', 'project', 'project.id = comment.projectId')
      .select([
        'project.id',
        'project.title AS title',
        'comment.id AS comment_id',
        'comment.commentText AS comment_commentText',
        `DATE_FORMAT(comment.updatedAt, '%Y.%m.%d') AS comment_updatedAt`,
      ])
      .getRawMany();

    return [...talk, ...study, ...project].sort((a: any, b: any) => {
      return (
        new Date(b['comment_updatedAt']).getTime() -
        new Date(a['comment_updatedAt']).getTime()
      );
    });
  }
}
