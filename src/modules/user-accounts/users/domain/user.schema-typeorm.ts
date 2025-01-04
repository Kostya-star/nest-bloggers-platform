import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'char varying',
    // length: 10,
    // unique: true,
  })
  login: string;

  @Column({
    type: 'char varying',
    // unique: true,
  })
  email: string;

  @Column({
    type: 'char varying',
  })
  hashed_password: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  email_confirmation_code: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  email_confirmation_exp_date: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  email_confirmation_is_confirmed: boolean;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  password_recovery_code: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  password_recovery_exp_date: Date | null;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date;
}
