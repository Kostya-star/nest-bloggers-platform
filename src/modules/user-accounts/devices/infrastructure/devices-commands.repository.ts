import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceDocument, IDeviceModel } from '../domain/device.schema';
import { RegisterDeviceDto } from '../dto/register-device.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { DataSource } from 'typeorm';
import { Device } from '../domain/device.schema-typeorm';

@Injectable()
export class DevicesCommandsRepository {
  constructor(
    @InjectModel(Device.name) private DeviceModel: IDeviceModel,
    private dataSource: DataSource,
  ) {}

  async findDeviceByDeviceId(deviceId: string): Promise<Device | null> {
    const device = await this.dataSource.query<Device[]>(
      `
        SELECT * FROM devices
        WHERE "deviceId" = $1 
      `,
      [deviceId],
    );
    return device[0] ?? null;
  }

  // __ASK__
  async registerDevice({
    deviceId,
    userId,
    issuedAt,
    expiresAt,
    userAgent,
    ipAddress,
    lastActiveDate,
  }: RegisterDeviceDto): Promise<void> {
    await this.dataSource.query<Device[]>(
      `
            INSERT INTO devices (
              "deviceId",
              "userId",
              "issuedAt",
              "expiresAt",
              "userAgent",
              "ipAddress",
              "lastActiveDate"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `,
      [deviceId, userId, issuedAt, expiresAt, userAgent, ipAddress, lastActiveDate],
    );

    // return device[0].id.toString();
  }

  async updateDevice(deviceId: string, updates: UpdateDeviceDto): Promise<void> {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');

    await this.dataSource.query(
      `
        UPDATE devices
        SET ${setClause}
        WHERE "deviceId" = $1
      `,
      [deviceId, ...values],
    );
  }

  async deleteOtherDevicesExceptCurrent(deviceId: string): Promise<void> {
    await this.dataSource.query(
      `
        DELETE FROM devices
        WHERE "deviceId" != $1
      `,
      [deviceId],
    );
  }

  async deleteDeviceByDeviceId(deviceId: string): Promise<void> {
    await this.dataSource.query(
      `
        DELETE FROM devices
        WHERE "deviceId" = $1
      `,
      [deviceId],
    );
  }
}
