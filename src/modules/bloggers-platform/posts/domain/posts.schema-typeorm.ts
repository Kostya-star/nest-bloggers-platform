import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.schema-typeorm';

export const postTitleConstraints = {
  maxLength: 30,
};

export const postDescriptionConstraints = {
  maxLength: 100,
};

export const postContentConstraints = {
  maxLength: 1000,
};

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: postTitleConstraints.maxLength, nullable: false })
  title: string;

  @Column({
    type: 'varchar',
    length: postDescriptionConstraints.maxLength,
    nullable: false,
  })
  shortDescription: string;

  @Column({ type: 'varchar', length: postContentConstraints.maxLength, nullable: false })
  content: string;

  @Column({ type: 'integer', nullable: false })
  blogId: number;

  @ManyToOne(() => Blog, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  blog: Blog;

  @Column({ type: 'varchar', nullable: false })
  blogName: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updatedAt: Date;
}
