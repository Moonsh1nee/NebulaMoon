import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { Field, FieldSchema } from './field.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Field.name, schema: FieldSchema }]),
  ],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [
    MongooseModule.forFeature([{ name: Field.name, schema: FieldSchema }]),
  ],
})
export class FieldsModule {}
