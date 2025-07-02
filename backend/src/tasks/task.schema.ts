import { User } from 'src/users/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/category.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId?: Category | string;

  @Prop()
  description?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ enum: ['low', 'medium', 'high'], default: 'low' })
  priority?: string;

  @Prop([String])
  tags?: string[];

  @Prop({
    type: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'none'],
        default: 'none',
      },
      until: { type: Date, required: false },
    },
  })
  recurrence?: {
    frequency: string;
    until?: Date;
  };

  @Prop({
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
    required: true,
  })
  status: string;

  @Prop([Date])
  reminders?: Date[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
