import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, database, up } from 'migrate-mongo';

@Injectable()
export class DatabaseService implements OnModuleInit {
  //config.Config 타입의 일부로, 모든 설정이 포함되지 않아도 되는 부분적 타입임을 Partial로 명시
  private readonly dbMigrationConfig: Partial<config.Config> = {
    //mongodb 객체:
    mongodb: {
      databaseName: this.configService.getOrThrow('COLLECTION_NAME'),
      url: this.configService.getOrThrow('MONGO_URI'), //getOrThrow -> 설정 값이 없을 경우, 예외를 발생시킵니다
    },
    migrationsDir: `${__dirname}/migrations`,
    changelogCollectionName: 'migrationLog', //MongoDB에서 마이그레이션의 변경 사항을 추적하기 위해 사용되는 컬렉션의 이름
    migrationFileExtension: '.js', //마이그레이션 파일의 확장자를 .js로 지정
  };

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    config.set(this.dbMigrationConfig);
    const { db, client } = await database.connect();
    //up 함수는 데이터베이스 스키마를 최신 상태로 업데이트하는 로직을 수행
    await up(db, client);
  }
}
