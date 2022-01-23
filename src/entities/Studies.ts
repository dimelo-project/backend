import { StudiesSkillsTags } from './StudiesSkillsTags';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { StudiesComments } from './StudiesComments';
import { ApiProperty } from '@nestjs/swagger';
import { StudiesSkills } from './StudiesSkills';

@Index('FK_study_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('studies', { schema: 'dimelo' })
export class Studies extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'study id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('enum', { name: 'ongoing', enum: ['모집중', '모집완료'] })
  ongoing: '모집중' | '모집완료';

  @Column('datetime', { name: 'duedate', nullable: true })
  duedate: Date | null;

  @Column('int', { name: 'participant', nullable: true })
  participant: number | null;

  @Column('int', { name: 'user_id' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.Studies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @RelationId((studies: Studies) => studies.User)
  UserId: number;

  @OneToMany(
    () => StudiesSkillsTags,
    (studiesSkillsTags) => studiesSkillsTags.Study,
  )
  StudiesSkillsTags: StudiesSkillsTags[];

  @OneToMany(() => StudiesComments, (studiesComments) => studiesComments.Study)
  StudiesComments: StudiesComments[];

  @ManyToMany(() => StudiesSkills, (studiesSkills) => studiesSkills.Studies)
  StudiesSkills: StudiesSkills[];
}
