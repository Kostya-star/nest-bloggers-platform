import { Injectable } from '@nestjs/common';
import { IUserModel } from '../domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../api/input-dto/create-user.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UserPasswordRecoveryDto } from '../dto/user-password-recovery.dto';
import { UserEmailConfirmationDto } from '../dto/user-email-confirmation.dto';
import { DataSource } from 'typeorm';
import { User } from '../domain/user.schema-typeorm';

@Injectable()
export class UsersCommandsRepository {
  constructor(
    @InjectModel(User.name) private UserModel: IUserModel,
    private dataSource: DataSource,
  ) {}
  async findUserById(userId: string): Promise<User | null> {
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE id = $1 
      `,
      [userId],
    );
    return user[0] ?? null;
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE login = $1 
      `,
      [login],
    );
    return user[0] ?? null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE email = $1 
      `,
      [email],
    );
    return user[0] ?? null;
  }

  async findUserByEmailConfirmationCode(code: string): Promise<User | null> {
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE email_confirmation_code = $1 
      `,
      [code],
    );
    return user[0] ?? null;
  }

  async findUserByPasswordRecoveryCode(code: string): Promise<User | null> {
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE password_recovery_code = $1
      `,
      [code],
    );

    return user[0] ?? null;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE login = $1
        OR email = $1
      `,
      [loginOrEmail],
    );

    return user[0] ?? null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    await this.dataSource.query(
      `
        UPDATE users
        SET ${setClause}
        WHERE id = $1
      `,
      [userId, ...values],
    );
  }

  async createUser({
    login,
    email,
    hashed_password,
    email_confirmation_code,
    email_confirmation_exp_date,
    email_confirmation_is_confirmed,
  }: CreateUserDto): Promise<string> {
    const user = await this.dataSource.query<User[]>(
      `
        INSERT INTO users (
          login, 
          email, 
          hashed_password, 
          email_confirmation_code, 
          email_confirmation_exp_date, 
          email_confirmation_is_confirmed
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [
        login,
        email,
        hashed_password,
        email_confirmation_code,
        email_confirmation_exp_date,
        email_confirmation_is_confirmed,
      ],
    );

    return user[0].id.toString();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.dataSource.query(
      `
        DELETE FROM users
        WHERE id = $1
      `,
      [userId],
    );
  }
}
