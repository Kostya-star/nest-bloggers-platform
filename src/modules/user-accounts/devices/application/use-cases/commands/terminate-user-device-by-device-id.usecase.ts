import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesCommandsRepository } from '../../../infrastructure/devices-commands.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class TerminateUserDeviceCommand {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}

@CommandHandler(TerminateUserDeviceCommand)
export class TerminateUserDeviceUseCase implements ICommandHandler<TerminateUserDeviceCommand, void> {
  constructor(private devicesCommandsRepository: DevicesCommandsRepository) {}
  async execute({ userId, deviceId }: TerminateUserDeviceCommand): Promise<void> {
    const device = await this.devicesCommandsRepository.findDeviceByDeviceId(deviceId);

    if (!device) {
      throw new NotFoundException('device not found');
    }

    const isOwner = device.userId.toString() === userId.toString();
    if (!isOwner) {
      throw new ForbiddenException();
    }

    await this.devicesCommandsRepository.deleteDeviceByDeviceId(deviceId);
  }
}
