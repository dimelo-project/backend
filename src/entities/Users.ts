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
import { SutdiesComments } from './SutdiesComments';
import { Talks } from './Talks';
import { TalksComments } from './TalksComments';

@Index('email_UNIQUE', ['email'], { unique: true })
@Index('id_UNIQUE', ['id'], { unique: true })
@Index('nickname_UNIQUE', ['nickname'], { unique: true })
@Entity('users', { schema: 'dimelo' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', unique: true, length: 30 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column('varchar', { name: 'image_url', nullable: true, length: 255 })
  imageUrl: string | null;

  @Column('varchar', { name: 'job', nullable: true, length: 45 })
  job: string | null;

  @Column('varchar', { name: 'career', nullable: true, length: 45 })
  career: string | null;

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

  @OneToMany(() => SutdiesComments, (sutdiesComments) => sutdiesComments.User)
  SutdiesComments: SutdiesComments[];

  @OneToMany(() => Talks, (talks) => talks.User)
  Talks: Talks[];

  @OneToMany(() => TalksComments, (talksComments) => talksComments.User)
  TalksComments: TalksComments[];
}
