import { GetCountStudiesDto } from './dto/get-count-studies.dto';
import { StudiesComments } from './../entities/StudiesComments';
import { GetStudiesDto } from './dto/get-studies.dto';
import { StudiesSkillsTags } from './../entities/StudiesSkillsTags';
import { StudiesSkills } from './../entities/StudiesSkills';
import { UpdateStudyDto } from './dto/update-study.dto';
import { CreateStudyDto } from './dto/create-study.dto';
import { Studies } from './../entities/Studies';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Users } from '../entities/Users';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(Studies)
    private readonly studiesRepository: Repository<Studies>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(StudiesSkills)
    private readonly studiesSkillsRepository: Repository<StudiesSkills>,
    @InjectRepository(StudiesComments)
    private readonly studiesCommentsRepository: Repository<StudiesComments>,
    private readonly connection: Connection,
  ) {}

  async getCount({ ongoing, skills }: GetCountStudiesDto) {
    const query = this.studiesRepository
      .createQueryBuilder('study')
      .innerJoin('study.StudiesSkills', 'skill');

    if (ongoing) {
      query.where('study.ongoing =:ongoing', { ongoing });
    }

    if (skills) {
      query.andWhere('skill.skill IN (:...skills)', { skills });
    }

    const num_study = await query.getCount();
    return {
      num_study: num_study.toString(),
    };
  }

  async getAllStudies({ ongoing, skills, perPage, page }: GetStudiesDto) {
    const query = this.studiesRepository
      .createQueryBuilder('study')
      .innerJoin('study.StudiesSkills', 'skill');

    if (ongoing) {
      query.where('study.ongoing =:ongoing', { ongoing });
    }

    if (skills) {
      query.andWhere('skill.skill IN (:...skills)', { skills });
    }

    const Comment = this.studiesCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'comment.studyId AS studyId',
        'COUNT(comment.id) AS num_comment',
      ])
      .from(StudiesComments, 'comment')
      .groupBy('comment.studyId')
      .getQuery();

    const Skill = this.studiesSkillsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'study.id AS studyId',
        'LOWER(GROUP_CONCAT(skill.skill)) AS skills',
      ])
      .from(StudiesSkills, 'skill')
      .innerJoin(StudiesSkillsTags, 'tag', 'tag.skillId = skill.id')
      .innerJoin(Studies, 'study', 'study.id = tag.studyId')
      .groupBy('study.id')
      .getQuery();

    const results = await query
      .innerJoin('study.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.studyId = study.id')
      .innerJoin(Skill, 'skill', 'skill.studyId = study.id')
      .select([
        'study.id',
        'study.title',
        'study.content',
        'study.ongoing',
        'study.participant',
        `DATE_FORMAT(study.createdAt, '%Y.%m.%d %H:%i') AS study_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment, 0) AS num_comment',
        'skill.skills AS study_skill',
      ])
      .groupBy('study.id')
      .orderBy('study_createdAt', 'DESC')
      .limit(perPage)
      .offset(perPage * (page - 1))
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        study_createdAt: result.study_createdAt.split(' ')[0].toString(),
      };
    });
  }

  async getStudy(id: number) {
    const study = await this.studiesRepository.findOne({ id });
    if (!study) {
      throw new NotFoundException('해당 스터디를 찾을 수 없습니다');
    }

    const query = this.studiesRepository.createQueryBuilder('study');

    const Comment = this.studiesCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'comment.studyId AS studyId',
        'COUNT(comment.id) AS num_comment',
      ])
      .from(StudiesComments, 'comment')
      .groupBy('comment.studyId')
      .getQuery();

    const Skill = this.studiesSkillsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'study.id AS studyId',
        'LOWER(GROUP_CONCAT(skill.skill)) AS skills',
      ])
      .from(StudiesSkills, 'skill')
      .innerJoin(StudiesSkillsTags, 'tag', 'tag.skillId = skill.id')
      .innerJoin(Studies, 'study', 'study.id = tag.studyId')
      .groupBy('study.id')
      .getQuery();

    return query
      .where('study.id =:id', { id })
      .innerJoin('study.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.studyId = study.id')
      .innerJoin(Skill, 'skill', 'skill.studyId = study.id')
      .select([
        'study.id',
        'study.title',
        'study.content',
        'study.markup',
        'study.ongoing',
        'study.participant',
        `DATE_FORMAT(study.createdAt, '%Y.%m.%d %H:%i') AS study_createdAt`,
        'user.nickname',
        'user.job',
        'user.career',
        'user.imageUrl AS user_imageUrl',
        'IFNULL(comment.num_comment, 0) AS num_comment',
        'skill.skills AS study_skill',
      ])
      .getRawOne();
  }

  async createStudy(
    { title, content, markup, participant, skills }: CreateStudyDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!user.nickname) {
      throw new ForbiddenException('프로필을 먼저 설정해주세요');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const skillsId = await Promise.all(
        skills.map(async (skill: string): Promise<number> => {
          let returnedSkill = await queryRunner.manager
            .getRepository(StudiesSkills)
            .findOne({ skill });
          if (!returnedSkill) {
            throw new BadRequestException('해당 기술이 존재하지 않습니다');
          }
          return returnedSkill.id;
        }),
      );

      const newStudy = new Studies();
      newStudy.title = title;
      newStudy.content = content;
      newStudy.markup = markup;
      newStudy.ongoing = '모집중';
      newStudy.participant = participant;
      newStudy.userId = user.id;

      const returnedStudy = await queryRunner.manager
        .getRepository(Studies)
        .save(newStudy);

      await Promise.all(
        skillsId.map(async (skillId: number): Promise<void> => {
          const skillTag = new StudiesSkillsTags();
          skillTag.studyId = returnedStudy.id;
          skillTag.skillId = skillId;
          await queryRunner.manager
            .getRepository(StudiesSkillsTags)
            .save(skillTag);
        }),
      );
      await queryRunner.commitTransaction();
      return returnedStudy;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStudy(
    id: number,
    userId: number,
    { title, content, markup, ongoing, participant, skills }: UpdateStudyDto,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const study = await this.studiesRepository.findOne({ id });
    if (!study) {
      throw new NotFoundException('해당 스터디가 없습니다');
    }
    const myStudy = await this.studiesRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!myStudy) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const skillsId = await Promise.all(
        skills.map(async (skill: string): Promise<number> => {
          let returnedSkill = await queryRunner.manager
            .getRepository(StudiesSkills)
            .findOne({ skill });
          if (!returnedSkill) {
            throw new BadRequestException('해당 기술이 존재하지 않습니다');
          }
          return returnedSkill.id;
        }),
      );

      myStudy.title = title;
      myStudy.content = content;
      myStudy.markup = markup;
      myStudy.ongoing = ongoing;
      myStudy.participant = participant;

      const returnedStudy = await queryRunner.manager
        .getRepository(Studies)
        .save(myStudy);

      await queryRunner.manager
        .getRepository(StudiesSkillsTags)
        .delete({ studyId: returnedStudy.id });

      await Promise.all(
        skillsId.map(async (skillId: number): Promise<void> => {
          await queryRunner.manager
            .getRepository(StudiesSkillsTags)
            .save({ studyId: returnedStudy.id, skillId });
        }),
      );
      await queryRunner.commitTransaction();
      return returnedStudy;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteStudy(id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const study = await this.studiesRepository.findOne({ id });
    if (!study) {
      throw new NotFoundException('해당 스터디가 없습니다');
    }
    const myStudy = await this.studiesRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!myStudy) {
      throw new ForbiddenException('삭제 권한이 없습니다');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(StudiesSkillsTags)
        .delete({ studyId: myStudy.id });

      await queryRunner.manager.getRepository(Studies).remove(myStudy);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllStudyComments(studyId: number) {
    const study = await this.studiesRepository.findOne({ id: studyId });
    if (!study) {
      throw new NotFoundException('해당하는 스터디를 찾을 수 없습니다');
    }
    return this.studiesCommentsRepository
      .createQueryBuilder('comment')
      .where('comment.studyId =:studyId', { studyId })
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

  async createStudyComment(
    studyId: number,
    userId: number,
    commentText: string,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!user.nickname) {
      throw new ForbiddenException('프로필을 먼저 설정해주세요');
    }
    const study = await this.studiesRepository.findOne({ id: studyId });
    if (!study) {
      throw new NotFoundException('해당하는 스터디를 찾을 수 없습니다');
    }
    return this.studiesCommentsRepository.save({
      userId: user.id,
      studyId: study.id,
      commentText,
    });
  }

  async updateStudyComment(
    studyId: number,
    id: number,
    userId: number,
    commentText: string,
  ) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const study = await this.studiesRepository.findOne({ id: studyId });
    if (!study) {
      throw new NotFoundException('해당하는 스터디를 찾을 수 없습니다');
    }
    const comment = await this.studiesCommentsRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException('해당 하는 댓글을 찾을 수 없습니다');
    }
    const myComment = await this.studiesCommentsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myComment) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }
    myComment.commentText = commentText;

    return this.studiesCommentsRepository.save(myComment);
  }

  async deleteStudyComment(studyId: number, id: number, userId: number) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const study = await this.studiesRepository.findOne({ id: studyId });
    if (!study) {
      throw new NotFoundException('해당하는 스터디를 찾을 수 없습니다');
    }
    const comment = await this.studiesCommentsRepository.findOne({ id });
    if (!comment) {
      throw new NotFoundException('해당 하는 댓글을 찾을 수 없습니다');
    }
    const myComment = await this.studiesCommentsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myComment) {
      throw new ForbiddenException('삭제 권한이 없습니다');
    }
    await this.studiesCommentsRepository.remove(myComment);
    return true;
  }

  async getCountMyStudies(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    return this.studiesRepository
      .createQueryBuilder('study')
      .where('study.userId =:id', { id })
      .select(['COUNT(study.id) AS num_study'])
      .getRawOne();
  }

  async getAllMyStudies(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }

    const Comment = this.studiesCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'comment.studyId AS studyId',
        'COUNT(comment.id) AS num_comment',
      ])
      .from(StudiesComments, 'comment')
      .groupBy('comment.studyId')
      .getQuery();

    return this.studiesRepository
      .createQueryBuilder('study')
      .where('study.userId =:id', { id })
      .leftJoin(Comment, 'comment', 'comment.studyId = study.id')
      .select([
        'study.id',
        'study.ongoing',
        'study.title',
        'study.content',
        `DATE_FORMAT(study.createdAt, '%Y.%m.%d %H:%i') AS study_createdAt`,
        'IFNULL(comment.num_comment,0) AS num_comment',
      ])
      .orderBy('study_createdAt', 'DESC')
      .getRawMany();
  }

  async getStudiesFromMain() {
    const query = this.studiesRepository
      .createQueryBuilder('study')
      .innerJoin('study.StudiesSkills', 'skill')
      .where(`study.ongoing = '모집중'`);

    const Comment = this.studiesCommentsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'comment.studyId AS studyId',
        'COUNT(comment.id) AS num_comment',
      ])
      .from(StudiesComments, 'comment')
      .groupBy('comment.studyId')
      .getQuery();

    const Skill = this.studiesSkillsRepository
      .createQueryBuilder()
      .subQuery()
      .select([
        'study.id AS studyId',
        'LOWER(GROUP_CONCAT(skill.skill)) AS skills',
      ])
      .from(StudiesSkills, 'skill')
      .innerJoin(StudiesSkillsTags, 'tag', 'tag.skillId = skill.id')
      .innerJoin(Studies, 'study', 'study.id = tag.studyId')
      .groupBy('study.id')
      .getQuery();

    const results = await query
      .innerJoin('study.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.studyId = study.id')
      .innerJoin(Skill, 'skill', 'skill.studyId = study.id')
      .select([
        'study.id',
        'study.title',
        'study.content',
        'study.ongoing',
        'study.participant',
        `DATE_FORMAT(study.createdAt, '%Y.%m.%d %H:%i') AS study_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment, 0) AS num_comment',
        'skill.skills AS study_skill',
      ])
      .groupBy('study.id')
      .orderBy('study_createdAt', 'DESC')
      .limit(2)
      .getRawMany();

    return results.map((result) => {
      return {
        ...result,
        study_createdAt: result.study_createdAt.split(' ')[0].toString(),
      };
    });
  }
}
