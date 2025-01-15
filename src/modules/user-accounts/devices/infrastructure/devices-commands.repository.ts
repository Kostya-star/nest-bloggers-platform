import { Injectable } from '@nestjs/common';
import { RegisterDeviceDto } from '../dto/register-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { Repository } from 'typeorm';
import { Device } from '../domain/device.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevicesCommandsRepository {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
  ) {}

  async findDeviceByDeviceId(deviceId: string): Promise<Device | null> {
    return await this.devicesRepository.findOne({ where: { deviceId } });
  }

  async registerDevice(newDevice: RegisterDeviceDto): Promise<void> {
    const device = this.devicesRepository.create({
      deviceId: newDevice.deviceId,
      userId: newDevice.userId,
      issuedAt: newDevice.issuedAt,
      expiresAt: newDevice.expiresAt,
      userAgent: newDevice.userAgent,
      ipAddress: newDevice.ipAddress,
      lastActiveDate: newDevice.lastActiveDate,
    });

    await this.devicesRepository.save(device);
  }

  async updateDevice(deviceId: string, updates: UpdateDeviceDto): Promise<void> {
    await this.devicesRepository.update(deviceId, updates);
  }

  async deleteOtherDevicesExceptCurrent(deviceId: string): Promise<void> {
    await this.devicesRepository.delete({ deviceId });
  }

  async deleteDeviceByDeviceId(deviceId: string): Promise<void> {
    await this.devicesRepository.delete({ deviceId });
  }
}
