import { User } from 'src/modules/user-accounts/users/domain/user.schema-typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.schema';

@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer', default: 0 })
  score: number;

  @OneToMany(() => Answer, (answers) => answers.player)
  answers: Answer[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
