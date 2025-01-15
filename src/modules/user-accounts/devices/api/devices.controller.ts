import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { DevicesQueryRepository } from '../infrastructure/devices-query.repository';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { RefreshJwtPayload } from 'src/core/dto/refresh-jwt-payload';
import { CommandBus } from '@nestjs/cqrs';
import { TerminateUserDeviceCommand } from '../application/use-cases/commands/terminate-user-device-by-device-id.usecase';
import { TerminateOtherDevicesCommand } from '../application/use-cases/commands/terminate-other-user-devices-except-current.usecase';

@Controller('security/devices')
export class DevicesController {
  constructor(
    private devicesQueryRepository: DevicesQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(AuthGuard('refresh-jwt-auth-guard'))
  async getUserDevices(@ExtractUserFromRequest() userTokenPayload: RefreshJwtPayload) {
    return await this.devicesQueryRepository.findUserDevices(userTokenPayload.userId);
  }

  @Delete(':deviceId')
  @UseGuards(AuthGuard('refresh-jwt-auth-guard'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateDevice(
    @ExtractUserFromRequest() userTokenPayload: RefreshJwtPayload,
    @Param('deviceId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }))
    deviceId: string,
  ) {
    await this.commandBus.execute<TerminateUserDeviceCommand, void>(
      new TerminateUserDeviceCommand(userTokenPayload.userId, deviceId),
    );
  }

  @Delete()
  @UseGuards(AuthGuard('refresh-jwt-auth-guard'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateOtherDevices(@ExtractUserFromRequest() userTokenPayload: RefreshJwtPayload) {
    const { deviceId, userId } = userTokenPayload;

    await this.commandBus.execute<TerminateOtherDevicesCommand, void>(
      new TerminateOtherDevicesCommand(deviceId, userId),
    );
  }
}
