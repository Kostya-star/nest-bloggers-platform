import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, IDeviceModel } from '../domain/device.schema';
import { RegisterDeviceDto } from '../dto/register-device.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';

@Injectable()
export class DevicesCommandsRepository {
  constructor(@InjectModel(Device.name) private DeviceModel: IDeviceModel) {}

  // async findDeviceById(deviceId: string): Promise<IDeviceDB | null> {
  //   return await this.DeviceModel.findOne({ deviceId });
  // }

  async registerDevice(device: RegisterDeviceDto): Promise<MongooseObjtId> {
    const item = await this.DeviceModel.create(device);
    return item._id;
  }

  // async updateDevice(deviceId: string, updates: Partial<ICreateDevicePayload>) {
  //   await this.DeviceModel.updateOne({ deviceId }, updates);
  // }

  // async deleteDevicesExceptCurrent(userId: MongooseObjtId, deviceId: string) {
  //   await this.DeviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
  // }

  // async deleteDeviceById(deviceId: string) {
  //   await this.DeviceModel.deleteOne({ deviceId });
  // }
}
