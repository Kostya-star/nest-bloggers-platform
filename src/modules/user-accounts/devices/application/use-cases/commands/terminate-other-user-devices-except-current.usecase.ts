import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesCommandsRepository } from '../../../infrastructure/devices-commands.repository';

export class TerminateOtherDevicesCommand {
  constructor(
    public deviceId: string,
    public userId: number,
  ) {}
}

@CommandHandler(TerminateOtherDevicesCommand)
export class TerminateOtherUserDevicesUseCase implements ICommandHandler<TerminateOtherDevicesCommand, void> {
  constructor(private devicesCommandsRepository: DevicesCommandsRepository) {}

  async execute({ deviceId, userId }: TerminateOtherDevicesCommand): Promise<void> {
    await this.devicesCommandsRepository.deleteOtherDevicesExceptCurrent(deviceId, userId);
  }
}
