import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Maps to the 'users' table
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Auto-incrementing primary key (matches `SERIAL`)

  @Column({
    type: 'char varying',
    // length: 10,
    // unique: true,
  })
  login: string; // Must be unique and between 3-10 characters

  @Column({
    type: 'char varying',
    // unique: true,
  })
  email: string; // Must be unique and follow email pattern

  @Column({
    name: 'hashed_password',
    type: 'char varying',
  })
  hashedPassword: string; // Hashed password

  @Column({
    name: 'email_confirmation_code',
    type: 'uuid',
    nullable: true,
  })
  emailConfirmationCode?: string; // UUID code for email confirmation

  @Column({
    name: 'email_confirmation_expiration',
    type: 'timestamptz',
    nullable: true,
  })
  emailConfirmationExpiration?: Date; // Expiration timestamp for email confirmation

  @Column({
    name: 'email_confirmed',
    type: 'boolean',
    default: true,
  })
  emailConfirmed: boolean; // Indicates if the email is confirmed

  @Column({
    name: 'password_recovery_code',
    type: 'uuid',
    nullable: true,
  })
  passwordRecoveryCode?: string; // UUID for password recovery

  @Column({
    name: 'password_recovery_expiration',
    type: 'timestamptz',
    nullable: true,
  })
  passwordRecoveryExpiration?: Date; // Expiration timestamp for password recovery

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date; // Automatically set to the current timestamp

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date; // Automatically updated on record modification
}
