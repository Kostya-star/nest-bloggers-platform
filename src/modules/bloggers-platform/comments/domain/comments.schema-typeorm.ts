import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export const commentContentConstraints = {
  minLength: 20,
  maxLength: 300,
};

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'char varying',
    length: commentContentConstraints.maxLength,
  })
  content: string;

  @Column({
    type: 'integer',
  })
  postId: number;

  @Column({ type: 'integer' })
  userId: number;

  // @Column('jsonb')
  // commentatorInfo: {
  //   userId: string;
  //   userLogin: string;
  // };

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
