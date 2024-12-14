import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  hashedPassword: string;

  @Prop({
    type: {
      code: { type: String, default: null },
      expDate: { type: Date, default: null },
      isConfirmed: { type: Boolean, default: true },
    },
  })
  emailConfirmation: {
    code: string | null;
    expDate: Date | null;
    isConfirmed: boolean;
  };

  @Prop({
    type: {
      code: { type: String, default: null },
      expDate: { type: Date, default: null },
    },
  })
  passwordConfirmation: {
    code: string | null;
    expDate: Date | null;
  };

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type IUserDocument = HydratedDocument<User>;
export type IUserModel = Model<User>;
