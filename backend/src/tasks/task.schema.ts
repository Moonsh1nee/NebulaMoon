import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

@Schema()
export class TaskField {
  @Prop({ type: Types.ObjectId, ref: 'Field', required: true })
  fieldId: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  value: any;
}

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop([{ type: TaskField }])
  fields: TaskField[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
