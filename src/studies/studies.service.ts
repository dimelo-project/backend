import { GetCountStudiesDto } from './dto/get-count-studies.dto';
import { StudiesComments } from './../entities/StudiesComments';
import { GetStudiesDto } from './dto/get-studies.dto';
import { StudiesSkillsTags } from './../entities/StudiesSkillsTags';
import { StudiesSkills } from './../entities/StudiesSkills';
import { UpdateStudyDto } from './dto/update-study.dto';
import { CreateStudyDto } from './dto/create-study.dto';
import { Studies } from './../entities/Studies';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Users } from 'src/entities/Users';

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

    return query.select(['COUNT(study.id) AS num_study']).getRawOne();
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

    return query
      .innerJoin('study.User', 'user')
      .leftJoin(Comment, 'comment', 'comment.studyId = study.id')
      .innerJoin(Skill, 'skill', 'skill.studyId = study.id')
      .select([
        'study.id',
        'study.title',
        'study.content',
        'study.ongoing',
        'study.participant',
        `DATE_FORMAT(study.createdAt, '%Y.%m.%d') AS study_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment, 0) AS num_comment',
        'skill.skills AS study_skill',
      ])
      .groupBy('study.id')
      .orderBy('study_createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getRawMany();
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
        'study.ongoing',
        'study.participant',
        `DATE_FORMAT(study.createdAt, '%Y.%m.%d %h:%i') AS study_createdAt`,
        'user.nickname',
        'IFNULL(comment.num_comment, 0) AS num_comment',
        'skill.skills AS study_skill',
      ])
      .getRawOne();
  }

  async createStudy(
    { title, content, ongoing, participant, skills }: CreateStudyDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
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
            returnedSkill = await queryRunner.manager
              .getRepository(StudiesSkills)
              .save({ skill });
          }
          return returnedSkill.id;
        }),
      );

      const newStudy = new Studies();
      newStudy.title = title;
      newStudy.content = content;
      newStudy.ongoing = ongoing;
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
    { title, content, ongoing, participant, skills }: UpdateStudyDto,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
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
            returnedSkill = await queryRunner.manager
              .getRepository(StudiesSkills)
              .save({ skill });
          }
          return returnedSkill.id;
        }),
      );

      myStudy.title = title;
      myStudy.content = content;
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
    const user = await this.usersRepository.findOne({ id: userId });
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

  async createStudyComment(
    studyId: number,
    userId: number,
    commentText: string,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
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
    const user = await this.usersRepository.findOne({ id: userId });
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
    const user = await this.usersRepository.findOne({ id: userId });
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
}
