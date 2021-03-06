import { GetCountTalksDto } from './dto/get-count-talks.dto';
import { UpdateTalkCommentDto } from './dto/update-talk-comment.dto';
import { TalksComments } from './../entities/TalksComments';
import { CreateTalkCommentDto } from './dto/create-talk-comment.dto';
import { UpdateTalkDto } from './dto/update-talk.dto';
import { ForbiddenError } from 'adminjs';
import { GetTalksDto } from './dto/get-talks.dto';
import { CreateTalkDto } from './dto/create-talk.dto';
import { Talks } from './../entities/Talks';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';

@Injectable()
export class TalksService {
  constructor(
    @InjectRepository(Talks)
    private readonly talksRepository: Repository<Talks>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(TalksComments)
    private readonly talksCommentsRepository: Repository<TalksComments>,
  ) {}

  async getCount({ category }: GetCountTalksDto) {
    const query = this.talksRepository.createQueryBuilder('talk');

    if (category) {
      query.where('talk.category =:category', { category });
    }

    const num_talk = await query.getCount();
    return {
      num_talk: num_talk.toString(),
    };
  }

  async getAllTalks({ category, perPage, page }: GetTalksDto) {
    const query = this.talksRepository.createQueryBuilder('talk');

    if (category) {
      query.where('talk.category =:category', { category });
    }

    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'COUNT(comment.id) AS num_comment'])
      .from(TalksComments, 'comment')
      .groupBy('comment.talkId')
      .getQuery();

    const results = await query
      .leftJoin(Comment, 'comment', 'comment.talkId = talk.id')
      .innerJoin('talk.User', 'user')
      .select([
        'talk.id',
        'talk.category',
        'talk.title',
        'talk.content',
        `DATE_FORMAT(talk.createdAt, '%Y.%m.%d %H:%i') AS talk_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .orderBy('talk_createdAt', 'DESC')
      .limit(perPage)
      .offset(perPage * (page - 1))
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        talk_createdAt: result.talk_createdAt.split(' ')[0].toString(),
      };
    });
  }

  async getTalk(id: number) {
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }

    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'COUNT(comment.id) AS num_comment'])
      .from(TalksComments, 'comment')
      .groupBy('comment.talkId')
      .getQuery();

    return this.talksRepository
      .createQueryBuilder('talk')
      .where('talk.id =:id', { id })
      .innerJoin('talk.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.talkId = talk.id')
      .select([
        'talk.id',
        'talk.category',
        'talk.title',
        'talk.content',
        'talk.markup',
        `DATE_FORMAT(talk.createdAt, '%Y.%m.%d %H:%i') AS talk_createdAt`,
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl AS user_imageUrl',
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .getRawOne();
  }

  async createTalk(
    { category, title, content, markup }: CreateTalkDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    if (!user.nickname) {
      throw new ForbiddenException('???????????? ?????? ??????????????????');
    }
    return this.talksRepository.save({
      category,
      title,
      content,
      markup,
      userId: user.id,
    });
  }

  async updateTalk(
    id: number,
    userId: number,
    { title, content, markup }: UpdateTalkDto,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }
    const myTalk = await this.talksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myTalk) {
      throw new ForbiddenError('?????? ????????? ????????????');
    }
    myTalk.title = title;
    myTalk.content = content;
    myTalk.markup = markup;

    return this.talksRepository.save(myTalk);
  }

  async deleteTalk(id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }
    const myTalk = await this.talksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myTalk) {
      throw new ForbiddenError('?????? ????????? ????????????');
    }
    await this.talksRepository.remove(myTalk);
    return true;
  }

  async getCountBySearch({ category }: GetCountTalksDto, keyword: string) {
    const query = this.talksRepository.createQueryBuilder('talk');

    if (category) {
      query.where('talk.category =:category', { category });
    }

    const num_talk = await query
      .andWhere('(talk.title LIKE :keyword OR talk.content LIKE :keyword)', {
        keyword: `%${keyword}%`,
      })
      .getCount();
    return {
      num_talk: num_talk.toString(),
    };
  }

  async searchTalk({ category, perPage, page }: GetTalksDto, keyword: string) {
    const query = this.talksRepository.createQueryBuilder('talk');

    if (category) {
      query.where('talk.category =:category', { category });
    }

    query.andWhere('(talk.title LIKE :keyword OR talk.content LIKE :keyword)', {
      keyword: `%${keyword}%`,
    });

    const result = await query.getMany();

    if (result.length === 0) {
      throw new NotFoundException('?????? ???????????? ?????? ?????? ??? ????????????');
    }
    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'COUNT(comment.id) AS num_comment'])
      .from(TalksComments, 'comment')
      .groupBy('comment.talkId')
      .getQuery();

    const results = await query
      .innerJoin('talk.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.talkId = talk.id')
      .select([
        'talk.id',
        'talk.category',
        'talk.title',
        'talk.content',
        `DATE_FORMAT(talk.createdAt, '%Y.%m.%d %H:%i') AS talk_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .orderBy('talk_createdAt', 'DESC')
      .limit(perPage)
      .offset(perPage * (page - 1))
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        talk_createdAt: result.talk_createdAt.split(' ')[0].toString(),
      };
    });
  }

  async getAllTalkComments(talkId: number) {
    const talk = await this.talksRepository.findOne({ id: talkId });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }
    return this.talksCommentsRepository
      .createQueryBuilder('comment')
      .where('comment.talkId =:talkId', { talkId })
      .innerJoin('comment.User', 'user')
      .select([
        'comment.id',
        'comment.commentText AS comment_commentText',
        `DATE_FORMAT(comment.createdAt, '%Y.%m.%d %H:%i') AS comment_createdAt`,
        `DATE_FORMAT(comment.updatedAt, '%Y.%m.%d %H:%i') AS comment_updatedAt`,
        'user.id',
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl AS user_imageUrl',
      ])
      .orderBy('comment_createdAt', 'ASC')
      .getRawMany();
  }

  async createTalkComment(
    id: number,
    userId: number,
    { commentText }: CreateTalkCommentDto,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    if (!user.nickname) {
      throw new ForbiddenException('???????????? ?????? ??????????????????');
    }
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }
    return this.talksCommentsRepository.save({
      userId: user.id,
      talkId: id,
      commentText,
    });
  }

  async updateTalkComment(
    talkId: number,
    id: number,
    userId: number,
    { commentText }: UpdateTalkCommentDto,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    const talk = await this.talksRepository.findOne({ id: talkId });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }
    const comment = await this.talksCommentsRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException('?????? ????????? ?????? ??? ????????????');
    }
    const myComment = await this.talksCommentsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myComment) {
      throw new ForbiddenException('?????? ????????? ????????????');
    }
    myComment.commentText = commentText;

    return this.talksCommentsRepository.save(myComment);
  }

  async deleteTalkComment(talkId: number, id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    const talk = await this.talksRepository.findOne({ id: talkId });
    if (!talk) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????');
    }
    const comment = await this.talksCommentsRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException('?????? ????????? ?????? ??? ????????????');
    }
    const myComment = await this.talksCommentsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myComment) {
      throw new ForbiddenException('?????? ????????? ????????????');
    }
    await this.talksCommentsRepository.remove(myComment);
    return true;
  }

  async getCountMyTalks(id: number) {
    const user = await this.usersRepository.findOne({ id, deletedAt: null });
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }
    return this.talksRepository
      .createQueryBuilder('talk')
      .where('talk.userId =:id', { id })
      .select(['COUNT(talk.id) AS num_talk'])
      .getRawOne();
  }

  async getAllMyTalks(id: number) {
    const user = await this.usersRepository.findOne({id, deletedAt: null});
    if (!user) {
      throw new UnauthorizedException('???????????? ?????? ????????????');
    }

    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'COUNT(comment.id) AS num_comment'])
      .from(TalksComments, 'comment')
      .groupBy('comment.talkId')
      .getQuery();

    const results = await this.talksRepository
      .createQueryBuilder('talk')
      .where('talk.userId =:id', { id })
      .leftJoin(Comment, 'comment', 'comment.talkId = talk.id')
      .select([
        'talk.id',
        'talk.category',
        'talk.title',
        'talk.content',
        `DATE_FORMAT(talk.createdAt, '%Y.%m.%d %H:%i') AS talk_createdAt`,
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .orderBy('talk_createdAt', 'DESC')
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        talk_createdAt: result.talk_createdAt.split(' ')[0].toString(),
      };
    });
  }
}
