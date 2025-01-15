import { Injectable } from '@nestjs/common';
import { DeviceViewDto } from '../api/view-dto/device-view.dto';
import { DataSource } from 'typeorm';
import { Device } from '../domain/device.schema-typeorm';

@Injectable()
export class DevicesQueryRepository {
  constructor(private dataSource: DataSource) {}

  async findUserDevices(userId: string): Promise<DeviceViewDto[]> {
    // const devices = await this.DeviceModel.find({ userId });
    const devices = await this.dataSource.query<Device[]>(
      `
        SELECT * FROM devices
        WHERE "userId" = $1
      `,
      [userId],
    );
    return devices.map((d) => new DeviceViewDto(d));
  }

  // async findUserDeviceByDeviceId(deviceId: string): Promise<DeviceViewDto | null> {
  //   const device = await this.DeviceModel.findOne({ deviceId });
  //   return device ? new DeviceViewDto(device) : null;
  // }
}
