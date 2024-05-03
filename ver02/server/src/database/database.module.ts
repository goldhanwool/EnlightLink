import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {
  //정적 메서드로, 명시적으로 호출되었을 때만 실행
  //각각의 모듈들에서 DatabaseModule.forFeature를 호출하여 모델과 해당 스키마를 등록
  //예 > imports: [cat-moduleDatabaseModule.forFeature([{ name: 'Cat', schema: CatSchema }])]
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
