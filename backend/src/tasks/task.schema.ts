import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';

export type TaskFieldDocument = HydratedDocument<TaskField>;

type fieldValue =
  | string
  | Date
  | { start: Date; end: Date }
  | string[]
  | boolean;

@Schema()
export class TaskField {
  @Prop({ type: Types.ObjectId, ref: 'Field', required: true })
  fieldId: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  value: fieldValue;
}

export const TaskFieldSchema = SchemaFactory.createForClass(TaskField);

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop([{ type: TaskFieldSchema }])
  fields: TaskField[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
