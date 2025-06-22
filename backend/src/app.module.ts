import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { FieldsModule } from './fields/fields.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:example@mongodb:27017/nebulamoon?authSource=admin',
    ),
    FieldsModule,
    TasksModule,
  ],
})
export class AppModule {}
