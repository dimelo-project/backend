import { UpdateTalkCommentDto } from './dto/update-talk-comment.dto';
import { TalksComments } from './../entities/TalksComments';
import { CreateTalkCommentDto } from './dto/create-talk-comment.dto';
import { SearchTalkDto } from './dto/search-talk.dto';
import { UpdateTalkDto } from './dto/update-talk.dto';
import { ForbiddenError } from 'adminjs';
import { GetTalksByCategoryDto } from './dto/get-talks-by-category.dto';
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
import { Users } from 'src/entities/Users';

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

  async getAllTalks({ category }: GetTalksByCategoryDto) {
    const query = this.talksRepository.createQueryBuilder('talk');

    if (category) {
      query.where('talk.category =:category', { category });
    }

    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'SUM(comment.id) AS num_comment'])
      .from(TalksComments, 'comment')
      .groupBy('comment.talkId')
      .getQuery();

    return query
      .leftJoin(Comment, 'comment', 'comment.talkId = talk.id')
      .innerJoin('talk.User', 'user')
      .select([
        'talk.id',
        'talk.category',
        'talk.title',
        'talk.content',
        `DATE_FORMAT(talk.createdAt, '%Y-%m-%d at %h:%i') AS talk_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .orderBy('talk_createdAt', 'DESC')
      .getRawMany();
  }

  async getTalk(id: number) {
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
    }

    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'SUM(comment.id) AS num_comment'])
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
        `DATE_FORMAT(talk.createdAt, '%Y-%m-%d at %h:%i') AS talk_createdAt`,
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl AS user_imageUrl',
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .getRawOne();
  }

  async createTalk(
    { category, title, content }: CreateTalkDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!user.nickname) {
      throw new ForbiddenException('프로필을 먼저 설정해주세요');
    }
    return this.talksRepository.save({
      category,
      title,
      content,
      userId: user.id,
    });
  }

  async updateTalk(
    id: number,
    userId: number,
    { category, title, content }: UpdateTalkDto,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
    }
    const myTalk = await this.talksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myTalk) {
      throw new ForbiddenError('수정 권한이 없습니다');
    }
    myTalk.category = category;
    myTalk.title = title;
    myTalk.content = content;

    return this.talksRepository.save(myTalk);
  }

  async deleteTalk(id: number, userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
    }
    const myTalk = await this.talksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!myTalk) {
      throw new ForbiddenError('삭제 권한이 없습니다');
    }
    await this.talksRepository.remove(myTalk);
    return true;
  }

  async searchTalk({ keyword }: SearchTalkDto) {
    const query = this.talksRepository
      .createQueryBuilder('talk')
      .where('(talk.title LIKE :keyword OR talk.content LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });

    const result = await query.getMany();

    if (result.length === 0) {
      throw new NotFoundException('해당 키워드의 글을 찾을 수 없습니다');
    }
    const Comment = this.talksCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select(['comment.talkId AS talkId', 'SUM(comment.id) AS num_comment'])
      .from(TalksComments, 'comment')
      .groupBy('comment.talkId')
      .getQuery();

    return query
      .innerJoin('talk.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.talkId = talk.id')
      .select([
        'talk.id',
        'talk.category',
        'talk.title',
        'talk.content',
        `DATE_FORMAT(talk.createdAt, '%Y-%m-%d at %h:%i') AS talk_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .orderBy('talk_createdAt', 'DESC')
      .getRawMany();
  }

  async getAllTalkComments(talkId: number) {
    const talk = await this.talksRepository.findOne({ id: talkId });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
    }
    return this.talksCommentsRepository
      .createQueryBuilder('comment')
      .where('comment.talkId =:talkId', { talkId })
      .innerJoin('comment.User', 'user')
      .select([
        'comment.id',
        'comment.commentText AS comment_commentText',
        `DATE_FORMAT(comment.createdAt, '%Y-%m-%d at %h:%i') AS comment_createdAt`,
        `DATE_FORMAT(comment.updatedAt, '%Y-%m-%d at %h:%i') AS comment_updatedAt`,
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
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const talk = await this.talksRepository.findOne({ id });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
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
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const talk = await this.talksRepository.findOne({ id: talkId });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
    }
    const comment = await this.talksCommentsRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다');
    }
    const myComment = await this.talksCommentsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myComment) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }
    myComment.commentText = commentText;

    return this.talksCommentsRepository.save(myComment);
  }

  async deleteTalkComment(talkId: number, id: number, userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const talk = await this.talksRepository.findOne({ id: talkId });
    if (!talk) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다');
    }
    const comment = await this.talksCommentsRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다');
    }
    const myComment = await this.talksCommentsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myComment) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }
    await this.talksCommentsRepository.remove(myComment);
    return true;
  }
}
