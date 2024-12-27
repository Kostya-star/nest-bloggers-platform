import { DeviceDocument } from '../../domain/device.schema';

export class DeviceViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor(device: DeviceDocument) {
    this.ip = device.ipAddress;
    this.title = device.userAgent;
    this.lastActiveDate = device.lastActiveDate;
    this.deviceId = device.deviceId;
  }
}
