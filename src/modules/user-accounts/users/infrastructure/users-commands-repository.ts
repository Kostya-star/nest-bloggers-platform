import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../api/input-dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersCommandsRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    return await this.usersRepository.findOne({ where: { login } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
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

  async createUser(newUser: CreateUserDto): Promise<number> {
    const user = this.usersRepository.create({
      login: newUser.login,
      email: newUser.email,
      hashedPassword: newUser.hashedPassword,
      emailConfirmationCode: newUser.emailConfirmationCode,
      emailConfirmationExpDate: newUser.emailConfirmationExpDate,
      emailConfirmationIsConfirmed: newUser.emailConfirmationIsConfirmed,
    });

    const savedUser = await this.usersRepository.save(user);
    return savedUser.id;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}
