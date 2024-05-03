import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadsRepository } from './uploads.repository';
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { FileUploadType } from './interface/file-upload.type';

@Injectable()
export class UploadsService {
  private readonly client: S3Client;

  constructor(
    private readonly uploadsReposity: UploadsRepository,
    private readonly configService: ConfigService,
  ) {
    const accessKeyId = configService.getOrThrow('AWS_ACCESS_KEY');
    const secretKeyId = configService.getOrThrow('AWS_SECRET_ACCESS_KEY');
    const region = configService.getOrThrow('AWS_REGION');
    const clientConfig: S3ClientConfig = {
      region,
    };

    if (accessKeyId && secretKeyId) {
      clientConfig.credentials = {
        accessKeyId,
        secretAccessKey: secretKeyId,
      };
    }

    this.client = new S3Client(clientConfig);
  }

  async upload({ bucket, key, file }: FileUploadType) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      }),
    );
  }

  async getObjectsUrl(bucket: string, key: string) {
    return `http://${bucket}.s3.amazonaws.com/${key}`;
  }

  async create(createUploadDto: CreateUploadDto, _id: string) {
    return this.uploadsReposity.create({
      ...createUploadDto,
      userId: _id,
      createdAt: new Date(),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload ${updateUploadDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
