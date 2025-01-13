import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UpdatePostDto } from '../api/input-dto/update-post.dto';

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
  id: string;

  @Column({ type: 'char varying', length: postTitleConstraints.maxLength, nullable: false })
  title: string;

  @Column({
    type: 'char varying',
    length: postDescriptionConstraints.maxLength,
    nullable: false,
  })
  short_description: string;

  @Column({ type: 'char varying', length: postContentConstraints.maxLength, nullable: false })
  content: string;

  @Column({ type: 'integer', nullable: false })
  blog_id: number;

  @Column({ type: 'char varying', nullable: false })
  blog_name: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;
}
