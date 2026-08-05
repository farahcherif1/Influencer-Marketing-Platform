import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { MediaType } from '../../common/enums/mediaType.enum';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET;
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  private async generatePresignedUrl(media: Media, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: media.s3Key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async uploadToS3(
    creatorId: number,
    type: MediaType,
    files: Express.Multer.File[],
  ) {
    const uploadedItems = await Promise.all(
      files.map(async (file) => {
        const key = `media/${Date.now()}-${file.originalname}`;

        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        if (type === MediaType.PROFILE_PICTURE) {
          await this.mediaRepository.delete({
            creatorId,
            type: MediaType.PROFILE_PICTURE,
          });
        }

        const media = this.mediaRepository.create({
          creatorId,
          url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          s3Key: key,
          type: type,
        });
        const saved = await this.mediaRepository.save(media);
        saved.url = await this.generatePresignedUrl(saved);
        return saved;
      }),
    );

    return uploadedItems;
  }

  async findAll(creatorId?: number): Promise<Media[]> {
    const medias = await this.mediaRepository.find({
      where: creatorId ? { creatorId } : {},
    });
    for (const media of medias) {
      media.url = await this.generatePresignedUrl(media);
    }

    return medias;
  }

  async findOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException(`Media with ID ${id} not found`);
    media.url = await this.generatePresignedUrl(media);
    return media;
  }

  async removeFromS3(id: number) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: media.s3Key,
      }),
    );

    return this.mediaRepository.delete(id);
  }
}
