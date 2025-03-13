import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Game } from './game.schema';
import { Question } from '../../questions/domain/question.schema';

@Entity('game_questions')
export class GameQuestions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  game: Game;

  @Column({ type: 'integer' })
  gameId: number;

  @ManyToOne(() => Question, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  question: Question;

  @Column({ type: 'integer' })
  questionId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
