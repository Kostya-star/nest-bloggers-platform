import { Device } from '../../domain/device.schema-typeorm';

export class DeviceViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  constructor(device: Device) {
    this.ip = device.ipAddress;
    this.title = device.userAgent;
    this.lastActiveDate = device.lastActiveDate;
    this.deviceId = device.deviceId;
  }
}
