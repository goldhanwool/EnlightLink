import { AbstractRepository } from 'src/database/database.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsRepository extends AbstractRepository<Upload> {
  protected readonly logger = new Logger(UploadsRepository.name);
  constructor(
    @InjectModel(Upload.name) private readonly uploadsModel: Model<Upload>,
  ) {
    super(uploadsModel);
  }
}
