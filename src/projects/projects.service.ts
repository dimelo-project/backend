import { ProjectsPositionsTags } from './../entities/ProjectsPositionsTags';
import { ProjectsSkillsTags } from './../entities/ProjectsSkillsTags';
import { ProjectsPositions } from './../entities/ProjectsPositions';
import { ProjectsSkills } from './../entities/ProjectsSkills';
import { CreateProjectDto } from './dto/create-project.dto';
import { Projects } from './../entities/Projects';
import {
  ForbiddenException,
  Injectable,
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
}
