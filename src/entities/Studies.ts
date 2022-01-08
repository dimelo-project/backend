import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { StudiesSkills } from './StudiesSkills';
import { StudiesComments } from './StudiesComments';
import { ApiProperty } from '@nestjs/swagger';

@Index('FK_study_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('studies', { schema: 'dimelo' })
export class Studies {
  @ApiProperty({
    example: 1,
    description: 'study id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '자바스크립트 같이 공부해요',
    description: '스터디 제목',
  })
  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @ApiProperty({
    example: '자바스크립트 딥다이브로 같이 공부해요',
    description: '스터디 내용',
  })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({
    example: '모집중',
    description: '모집중/모집완료',
  })
  @Column('enum', { name: 'ongoing', enum: ['모집중', '모집완료'] })
  ongoing: '모집중' | '모집완료';

  @ApiProperty({
    example: '2022-01-01',
    description: '모집을 진행하는 날짜',
  })
  @Column('datetime', { name: 'duedate', nullable: true })
  duedate: Date | null;

  @ApiProperty({
    example: 2,
    description: '모집하는 참여자 수',
  })
  @Column('int', { name: 'participant', nullable: true })
  participant: number | null;

  @ApiProperty({
    example: 1,
    description: '글을 작성한 user id',
  })
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

  @ManyToMany(() => StudiesSkills, (studiesSkills) => studiesSkills.Studies)
  StudiesSkills: StudiesSkills[];

  @OneToMany(() => StudiesComments, (studiesComments) => studiesComments.Study)
  StudiesComments: StudiesComments[];
}
