import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Player } from './player.schema';
import { AnswerStatus } from '../dto/answer-status';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  player: Player;

  @Column({ type: 'integer' })
  playerId: number;

  @Column({ type: 'integer' })
  questionId: number;

  @Column({ type: 'enum', enum: AnswerStatus })
  status: AnswerStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
