import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Likes } from './Likes';
import { Projects } from './Projects';
import { ProjectsComments } from './ProjectsComments';
import { Reviews } from './Reviews';
import { Studies } from './Studies';
import { StudiesComments } from './StudiesComments';
import { Talks } from './Talks';
import { TalksComments } from './TalksComments';

@Index('email_UNIQUE', ['email'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('nickname_UNIQUE', ['nickname'], { unique: true })
@Entity('users', { schema: 'dimelo' })
export class Users {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 'vltndus95@gmail.com',
    description: '사용자 이메일',
  })
  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @ApiProperty({
    example: 'Avery',
    description: '사용자 닉네임',
  })
  @Column('varchar', { name: 'nickname', unique: true, length: 30 })
  nickname: string;

  @ApiProperty({
    example: '123123',
    description: '사용자 비밀번호',
  })
  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/77389332?v=4',
    description: '사용자 프로필 사진',
  })
  @Column('varchar', { name: 'image_url', nullable: true, length: 255 })
  imageUrl: string | null;

  @ApiProperty({
    example: '백엔드 개발자',
    description: '사용자 직무',
  })
  @Column('varchar', { name: 'job', nullable: true, length: 45 })
  job: string | null;

  @ApiProperty({
    example: '1년차 이하',
    description: '사용자 경력',
  })
  @Column('varchar', { name: 'career', nullable: true, length: 45 })
  career: string | null;

  @ApiProperty({
    example: '안녕하세요!',
    description: '자기소개',
  })
  @Column('text', { name: 'introduction', nullable: true })
  introduction: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Likes, (likes) => likes.User)
  Likes: Likes[];

  @OneToMany(() => Projects, (projects) => projects.User)
  Projects: Projects[];

  @OneToMany(
    () => ProjectsComments,
    (projectsComments) => projectsComments.User,
  )
  ProjectsComments: ProjectsComments[];

  @ManyToMany(() => Reviews, (reviews) => reviews.Users)
  Reviews2: Reviews[];

  @OneToMany(() => Reviews, (reviews) => reviews.User)
  Reviews: Reviews[];

  @OneToMany(() => Studies, (studies) => studies.User)
  Studies: Studies[];

  @OneToMany(() => StudiesComments, (studiesComments) => studiesComments.User)
  StudiesComments: StudiesComments[];

  @OneToMany(() => Talks, (talks) => talks.User)
  Talks: Talks[];

  @OneToMany(() => TalksComments, (talksComments) => talksComments.User)
  TalksComments: TalksComments[];
}
