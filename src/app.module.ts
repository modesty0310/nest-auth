import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_SECRET,
      database: process.env.DB_NAME,
      logging: process.env.NODE_ENV === 'production' ? false : true,
      synchronize: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
