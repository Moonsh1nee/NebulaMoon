import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Field extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['text', 'date', 'double-date', 'select', 'multi-select', 'checkbox'],
  })
  type: string;

  @Prop({ type: [String], default: [] })
  options: string[];
}

export const FieldSchema = SchemaFactory.createForClass(Field);
