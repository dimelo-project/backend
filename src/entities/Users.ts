import { ReviewHelpes } from './ReviewHelpes';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
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
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', nullable: true, length: 30 })
  email: string | null;

  @Column('varchar', {
    name: 'nickname',
    unique: true,
    length: 30,
    nullable: true,
  })
  nickname: string | null;

  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column('varchar', { name: 'image_url', nullable: true, length: 255 })
  imageUrl: string | null;

  @Column('varchar', { name: 'job', nullable: true, length: 45 })
  job: string | null;

  @Column('varchar', { name: 'career', nullable: true, length: 45 })
  career: string | null;

  @Column('int', { name: 'google_id', nullable: true })
  googleId: number | null;

  @Column('int', { name: 'github_id', nullable: true })
  githubId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('date', { name: 'deleted_at', nullable: true })
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

  @OneToMany(() => ReviewHelpes, (reviewHelpes) => reviewHelpes.User)
  ReviewHelpes: ReviewHelpes[];

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

  @ManyToMany(() => Reviews, (reviews) => reviews.Users)
  Help: Reviews[];
}
