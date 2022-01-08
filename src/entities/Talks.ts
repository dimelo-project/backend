import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { TalksComments } from './TalksComments';

@Index('FK_talk_user_idx', ['userId'], {})
@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('talks', { schema: 'dimelo' })
export class Talks {
  @ApiProperty({
    example: 1,
    description: 'talk id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '개발',
    description: '자유게시판 카테고리',
  })
  @Column('enum', {
    name: 'category',
    enum: ['개발', '데이터', '디자인', '기타'],
  })
  category: '개발' | '데이터' | '디자인' | '기타';

  @ApiProperty({
    example: '웹개발 로드맵 질문',
    description: '자유게시판 제목',
  })
  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @ApiProperty({
    example: '프론트엔드 개발 로드맵 짜주세요',
    description: '자유게시판 글 내용',
  })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({
    example: 1,
    description: '자유게시판 글 작성자 user id',
  })
  @Column('int', { name: 'user_id' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.Talks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: Users;

  @OneToMany(() => TalksComments, (talksComments) => talksComments.Talk)
  TalksComments: TalksComments[];
}
