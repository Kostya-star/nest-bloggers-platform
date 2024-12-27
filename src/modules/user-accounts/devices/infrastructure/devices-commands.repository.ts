import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument, IDeviceModel } from '../domain/device.schema';
import { RegisterDeviceDto } from '../dto/register-device.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateDeviceDto } from '../dto/update-device.dto';

@Injectable()
export class DevicesCommandsRepository {
  constructor(@InjectModel(Device.name) private DeviceModel: IDeviceModel) {}

  async findDeviceByDeviceId(deviceId: string): Promise<DeviceDocument | null> {
    return await this.DeviceModel.findOne({ deviceId });
  }

  async registerDevice(device: RegisterDeviceDto): Promise<MongooseObjtId> {
    const item = await this.DeviceModel.create(device);
    return item._id;
  }

  async updateDevice(deviceId: string, updates: UpdateDeviceDto) {
    await this.DeviceModel.updateOne({ deviceId }, updates);
  }

  async deleteOtherDevicesExceptCurrent(deviceId: string) {
    await this.DeviceModel.deleteMany({ deviceId: { $ne: deviceId } });
  }

  async deleteDeviceByDeviceId(deviceId: string) {
    await this.DeviceModel.deleteOne({ deviceId });
  }
}
