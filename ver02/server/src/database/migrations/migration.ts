import { Db } from 'mongodb'; // Db -> MongoDB 데이터베이스의 인스턴스

module.exports = {
  // up이라는 비동기 함수가 정의 -> 데이터베이스 마이그레이션(데이터 구조 변경, 인덱스 생성 등)을 수행할 때 사용
  async up(db: Db) {
    //users 컬렉션에 대해 email 필드에 대한 인덱스를 생성 -> 인덱스는 오름차순(1)으로 생성
    //{ unique: true } 옵션을 통해 이메일 필드의 값이 유일하도록 강제
    await db.collection('users').createIndex({ ip: 1 }, { unique: false });
  },
};
