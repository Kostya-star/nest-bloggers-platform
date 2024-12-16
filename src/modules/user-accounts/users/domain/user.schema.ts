import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/,
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const emailConstraints = {
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, ...loginConstraints })
  login: string;

  @Prop({ type: String, required: true, ...emailConstraints })
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
