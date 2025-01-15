import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../api/input-dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersCommandsRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserById(userId: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }

  async findUserByLogin(login: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { login } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findUserByEmailConfirmationCode(code: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { emailConfirmationCode: code } });
  }

  async findUserByPasswordRecoveryCode(code: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { passwordRecoveryCode: code } });
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return user ?? null;
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<void> {
    await this.usersRepository.update(userId, updates);
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
