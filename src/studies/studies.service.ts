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
    private readonly connection: Connection,
  ) {}

  async getAllStudies() {}

  async createStudy(
    { title, content, ongoing, duedate, participant, skills }: CreateStudyDto,
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
      newStudy.duedate = duedate;
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
    { title, content, ongoing, duedate, participant, skills }: UpdateStudyDto,
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
      myStudy.duedate = duedate;
      myStudy.participant = participant;

      const returnedStudy = await queryRunner.manager
        .getRepository(Studies)
        .save(myStudy);

      await queryRunner.manager
        .getRepository(StudiesSkillsTags)
        .delete({ studyId: returnedStudy.id });

      await Promise.all(
        skillsId.map(async (skillId: number): Promise<void> => {
          const tag = await queryRunner.manager
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
}
