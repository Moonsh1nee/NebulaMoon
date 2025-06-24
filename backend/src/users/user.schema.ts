import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface User extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name?: string;
}

@Schema({ timestamps: true })
export class UserSchemaClass extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
