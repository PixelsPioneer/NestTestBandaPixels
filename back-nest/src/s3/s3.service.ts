import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import axios from 'axios';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    try {
      this.s3 = new S3Client({
        region: this.configService.getOrThrow<string>('AWS_REGION') ?? '',
        credentials: {
          accessKeyId:
            this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID') ?? '',
          secretAccessKey:
            this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY') ??
            '',
        },
      });

      this.bucketName =
        this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME') ?? '';

      this.logger.log('Successfully connected to AWS S3');
    } catch (error) {
      this.logger.error('Error connecting to AWS S3', error);
      throw error;
    }
  }

  async uploadImage(
    imageUrl: string,
    productId: string,
  ): Promise<string | null> {
    try {
      this.logger.log(`Attempting to download image from: ${imageUrl}`);

      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      const fileExtension = path.extname(imageUrl)?.split('?')[0] || '.jpg';
      const fileName = `products/${productId}_${Date.now()}${fileExtension}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: response.data,
        ContentType: response.headers['content-type'],
      };

      this.logger.log(`Uploading image: ${fileName} to S3`);

      await this.s3.send(new PutObjectCommand(uploadParams));

      this.logger.log(`Image successfully uploaded: ${fileName}`);

      const presignedUrl = await this.generatePresignedUrl(fileName);

      return presignedUrl;
    } catch (error) {
      this.logger.error(`Failed to upload image from: ${imageUrl}`, error);
      return null;
    }
  }

  public async generatePresignedUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 3600,
      });

      return signedUrl;
    } catch (error) {
      this.logger.error(
        'Error generating presigned URL for key: ' + key,
        error,
      );
      throw new Error('Failed to generate presigned URL');
    }
  }
}
