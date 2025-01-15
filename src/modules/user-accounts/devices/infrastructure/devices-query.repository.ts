import { Injectable } from '@nestjs/common';
import { DeviceViewDto } from '../api/view-dto/device-view.dto';
import { Device } from '../domain/device.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
  ) {}

  async findUserDevices(userId: number): Promise<DeviceViewDto[]> {
    const devices = await this.devicesRepository.find({ where: { userId } });
    return devices.map((d) => new DeviceViewDto(d));
  }

  // async findUserDeviceByDeviceId(deviceId: string): Promise<DeviceViewDto | null> {
  //   const device = await this.DeviceModel.findOne({ deviceId });
  //   return device ? new DeviceViewDto(device) : null;
  // }
}
