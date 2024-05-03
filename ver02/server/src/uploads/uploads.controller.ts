import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { multerConfig } from 'src/common/utils';
import { Express } from 'express';
import { UploadsRepository } from './uploads.repository';
import { RagService } from 'src/rag/rag.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';
import * as pdfParse from 'pdf-parse';
import { ChatService } from 'src/chat/chat.service';

@ApiTags('Uploads')
@Controller()
export class UploadsController {
  constructor(
    private readonly uploadService: UploadsService,
    private readonly uploadReposity: UploadsRepository,
    private readonly ragService: RagService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
  ) {}

  @Post('upload/aws')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a single image file' })
  @ApiResponse({ status: 201, description: 'File successfully uploaded.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    //채팅방 개수 체크
    const checkChatCount = await this.chatService.findChats();

    if (checkChatCount.length > 50) {
      throw new NotFoundException(
        'The number of chat rooms must be less than 50.',
      );
    }

    const pdfData = await pdfParse(file.buffer);
    const textTokens = pdfData.text.split(/\s+/);
    const tokenCount = textTokens.length;

    //10000개 이상의 토큰이 있는 PDF 파일 로드시 무료버전 파인콘에서 에러를 뱉음.
    if (tokenCount > 10000) {
      throw new NotFoundException(
        'The number of tokens in the PDF file must be less than 5000.',
      );
    }

    try {
      const key = `${uuidv4()}END-START${file.originalname}`;
      await this.uploadService.upload({
        bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
        key: key,
        file: file.buffer,
      });
      const awsUrl = await this.uploadService.getObjectsUrl(
        this.configService.getOrThrow('AWS_BUCKET_NAME'),
        key,
      );
      return { awsUrl: awsUrl };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '신규 업로드 파일' })
  @ApiResponse({ status: 201, description: 'File successfully uploaded.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const filename = file.filename;
    const originFileName = file.originalname;
    const filePath = file.path;

    try {
      //namespace, index 리턴함수
      const { namespace, index } = await this.ragService.createVector(
        filePath,
        filename,
      );
      if (!namespace || !index) {
        throw new Error('Failed to create vector');
      }

      await fsPromises.unlink(filePath);

      return {
        originFileName: originFileName,
        filename: filename,
        namespace: namespace,
        index: index,
      };
    } catch (error: any) {
      await fsPromises.unlink(filePath);
      throw new Error(error);
    }
  }
} // end of class
