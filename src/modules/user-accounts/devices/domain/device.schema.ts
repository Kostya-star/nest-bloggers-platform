import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Device {
  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  issuedAt: string;

  @Prop({ type: String, required: true })
  expiresAt: string;

  @Prop({ type: String, required: true })
  userAgent: string;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: String, required: true })
  lastActiveDate: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

export type DeviceDocument = HydratedDocument<Device>;
export type IDeviceModel = Model<Device>;
