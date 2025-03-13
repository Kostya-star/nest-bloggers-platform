import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const questionBodyConstraints = {
  minLength: 10,
  maxLength: 500,
};

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    // length: questionBodyConstraints.maxLength,
  })
  body: string;

  @Column({
    type: 'json',
  })
  correctAnswers: string[];

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
