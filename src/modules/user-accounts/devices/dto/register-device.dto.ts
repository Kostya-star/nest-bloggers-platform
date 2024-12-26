import { MongooseObjtId } from 'src/core/types/mongoose-objectId';

export class RegisterDeviceDto {
  deviceId: string;
  userId: MongooseObjtId;
  issuedAt: string;
  expiresAt: string;
  userAgent: string;
  ipAddress: string;
  lastActiveDate: string;
}
