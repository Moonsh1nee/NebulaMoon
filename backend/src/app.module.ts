import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { FieldsModule } from './fields/fields.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/NebulaMoon'),
    FieldsModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
