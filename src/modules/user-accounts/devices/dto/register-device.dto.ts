export class RegisterDeviceDto {
  deviceId: string;
  userId: number;
  issuedAt: string;
  expiresAt: string;
  userAgent: string;
  ipAddress: string;
  lastActiveDate: string;
}
