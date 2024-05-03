import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadsService } from './uploads.service';
import { Upload } from './entities/upload.entity';
import { CreateUploadDto } from './dto/create-upload.dto';
import { CurrentUser } from 'src/auth/decorator/current-user';
import { JwtToken } from 'src/common/interface';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.guard';

@Resolver()
export class UploadsResolver {
  constructor(private readonly uploadsService: UploadsService) {}

  @Mutation(() => Upload)
  @UseGuards(GqlAuthGuard)
  async createUpload(
    @Args('createUploadDto') createUploadDto: CreateUploadDto,
    @CurrentUser() user: JwtToken,
  ) {
    return this.uploadsService.create(createUploadDto, user._id);
  }
}
