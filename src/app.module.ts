import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
    }),
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
