import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { FieldsModule } from './fields/fields.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/NebulaMoon'),
    FieldsModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
