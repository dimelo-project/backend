import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsPositionsTags } from './../entities/ProjectsPositionsTags';
import { ProjectsSkillsTags } from './../entities/ProjectsSkillsTags';
import { ProjectsPositions } from './../entities/ProjectsPositions';
import { ProjectsSkills } from './../entities/ProjectsSkills';
import { CreateProjectDto } from './dto/create-project.dto';
import { Projects } from './../entities/Projects';
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
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectsRepository: Repository<Projects>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly connection: Connection,
  ) {}

  async createProject(
    {
      title,
      content,
      ongoing,
      duedate,
      participant,
      positions,
      skills,
    }: CreateProjectDto,
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
      const newProject = new Projects();
      newProject.title = title;
      newProject.content = content;
      newProject.ongoing = ongoing;
      newProject.duedate = duedate;
      newProject.participant = participant;
      newProject.userId = user.id;

      const returnedProject = await queryRunner.manager
        .getRepository(Projects)
        .save(newProject);

      const skillsId: number[] = await Promise.all(
        skills.map(async (skill: string): Promise<number> => {
          let returnedSkill = await queryRunner.manager
            .getRepository(ProjectsSkills)
            .findOne({ skill });
          if (!returnedSkill) {
            returnedSkill = await queryRunner.manager
              .getRepository(ProjectsSkills)
              .save({ skill });
          }
          return returnedSkill.id;
        }),
      );

      await Promise.all(
        skillsId.map(async (skillId: number): Promise<void> => {
          const skillTag = new ProjectsSkillsTags();
          skillTag.projectId = returnedProject.id;
          skillTag.skillId = skillId;
          await queryRunner.manager
            .getRepository(ProjectsSkillsTags)
            .save(skillTag);
        }),
      );

      if (positions) {
        const positionsId: number[] = await Promise.all(
          positions.map(async (position: string): Promise<number> => {
            let returnedPosition = await queryRunner.manager
              .getRepository(ProjectsPositions)
              .findOne({ position });
            if (!returnedPosition) {
              returnedPosition = await queryRunner.manager
                .getRepository(ProjectsPositions)
                .save({ position });
            }
            return returnedPosition.id;
          }),
        );

        await Promise.all(
          positionsId.map(async (positionId: number): Promise<void> => {
            const positionTag = new ProjectsPositionsTags();
            positionTag.projectId = returnedProject.id;
            positionTag.positionId = positionId;
            await queryRunner.manager
              .getRepository(ProjectsPositionsTags)
              .save(positionTag);
          }),
        );
      }
      await queryRunner.commitTransaction();
      return returnedProject;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateProject(
    id: number,
    {
      title,
      content,
      ongoing,
      duedate,
      participant,
      positions,
      skills,
    }: UpdateProjectDto,
    userId: number,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const project = await this.projectsRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException('해당 프로젝트를 찾을 수 없습니다');
    }
    const myProject = await this.projectsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myProject) {
      throw new ForbiddenException('수정 권한이 없습니다');
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      myProject.title = title;
      myProject.content = content;
      myProject.ongoing = ongoing;
      myProject.duedate = duedate;
      myProject.participant = participant;

      const returnedProject = await queryRunner.manager
        .getRepository(Projects)
        .save(myProject);

      await queryRunner.manager
        .getRepository(ProjectsSkillsTags)
        .delete({ projectId: returnedProject.id });

      await queryRunner.manager
        .getRepository(ProjectsPositionsTags)
        .delete({ projectId: returnedProject.id });

      const skillsId: number[] = await Promise.all(
        skills.map(async (skill: string): Promise<number> => {
          let returnedSkill = await queryRunner.manager
            .getRepository(ProjectsSkills)
            .findOne({ skill });
          if (!returnedSkill) {
            returnedSkill = await queryRunner.manager
              .getRepository(ProjectsSkills)
              .save({ skill });
          }
          return returnedSkill.id;
        }),
      );
      await Promise.all(
        skillsId.map(async (skillId: number): Promise<void> => {
          await queryRunner.manager
            .getRepository(ProjectsSkillsTags)
            .save({ projectId: returnedProject.id, skillId });
        }),
      );

      if (positions) {
        const positionsId: number[] = await Promise.all(
          positions.map(async (position: string): Promise<number> => {
            let returnedPosition = await queryRunner.manager
              .getRepository(ProjectsPositions)
              .findOne({ position });
            if (!returnedPosition) {
              returnedPosition = await queryRunner.manager
                .getRepository(ProjectsPositions)
                .save({ position });
            }
            return returnedPosition.id;
          }),
        );
        await Promise.all(
          positionsId.map(async (positionId: number): Promise<void> => {
            await queryRunner.manager
              .getRepository(ProjectsPositionsTags)
              .save({ projectId: returnedProject.id, positionId });
          }),
        );
      }
      await queryRunner.commitTransaction();
      return returnedProject;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProject(id: number, userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    const project = await this.projectsRepository.findOne({ id });
    if (!project) {
      throw new NotFoundException('해당 프로젝트를 찾을 수 없습니다');
    }
    const myProject = await this.projectsRepository.findOne({
      id,
      userId: user.id,
    });
    if (!myProject) {
      throw new ForbiddenException('삭제 권한이 없습니다');
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .getRepository(ProjectsSkillsTags)
        .delete({ projectId: myProject.id });

      await queryRunner.manager
        .getRepository(ProjectsPositionsTags)
        .delete({ projectId: myProject.id });

      await queryRunner.manager.getRepository(Projects).remove(myProject);

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
