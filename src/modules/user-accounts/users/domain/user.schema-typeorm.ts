import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/,
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const emailConstraints = {
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: loginConstraints.maxLength,
    unique: true,
    nullable: false,
  })
  login: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    // nullable: false,
  })
  hashedPassword: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  emailConfirmationCode: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  emailConfirmationExpDate: Date | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  emailConfirmationIsConfirmed: boolean;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  passwordRecoveryCode: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  passwordRecoveryExpDate: Date | null;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt: Date;
}
