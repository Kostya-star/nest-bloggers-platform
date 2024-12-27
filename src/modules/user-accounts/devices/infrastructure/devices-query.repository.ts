import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, IDeviceModel } from '../domain/device.schema';
import { DeviceViewDto } from '../api/view-dto/device-view.dto';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectModel(Device.name) private DeviceModel: IDeviceModel) {}

  async findUserDevices(userId: string): Promise<DeviceViewDto[]> {
    const devices = await this.DeviceModel.find({ userId });
    return devices.map((d) => new DeviceViewDto(d));
  }

  // async findUserDeviceByDeviceId(deviceId: string): Promise<DeviceViewDto | null> {
  //   const device = await this.DeviceModel.findOne({ deviceId });
  //   return device ? new DeviceViewDto(device) : null;
  // }
}
