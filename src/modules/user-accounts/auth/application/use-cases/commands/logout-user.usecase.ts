import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesCommandsRepository } from 'src/modules/user-accounts/devices/infrastructure/devices-commands.repository';

export class LogoutUserCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand, void> {
  constructor(private devicesCommandsRepository: DevicesCommandsRepository) {}

  async execute({ deviceId }: LogoutUserCommand): Promise<void> {
    await this.devicesCommandsRepository.deleteDeviceByDeviceId(deviceId);
  }
}
