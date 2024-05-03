import { Logger, UnauthorizedException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractEntity } from './entity/abstract.entity';

//<T extends AbstractEntity> => T 타입에 대한 AbstractEntity를 정확히는 '_id' 상속 받겠다는 의미
export abstract class AbstractRepository<T extends AbstractEntity> {
  //Mongoose의 Model 인터페이스를 임포트.
  //이 인터페이스는 MongoDB 컬렉션에 대한 작업을 수행하기 위한 메소드를 제공
  constructor(protected readonly model: Model<T>) {}

  protected abstract readonly logger: Logger;

  async create(document: Omit<T, '_id'>): Promise<T> {
    try {
      const createDocument = new this.model({
        ...document,
        _id: new Types.ObjectId(),
      });
      return (await createDocument.save()).toJSON() as unknown as T;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  //filterQuery를 사용하고자 할 때 다음과 같은 예시 -> const filterQuery = { age: { $gte: 30 } };
  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = this.model.findOne(filterQuery).lean<T>();
    if (!document) {
      throw new UnauthorizedException('Document not found');
    }
    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    const document = this.model.find(filterQuery).lean<T[]>();
    if (!document) {
      throw new UnauthorizedException('Document not found');
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model.findOneAndUpdate(filterQuery, update);
    if (!document) {
      throw new UnauthorizedException('Document not found');
    }
    return document;
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOneAndDelete(filterQuery);
    if (!document) {
      throw new UnauthorizedException('Document not found');
    }
    return document;
  }
}
