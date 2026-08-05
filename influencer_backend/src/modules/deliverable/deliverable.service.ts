import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Deliverable } from './entities/deliverable.entity';
import { CreateLinkDto } from './dto/deliverable.dto';

@Injectable()
export class DeliverableService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET;

  constructor(
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  private async generatePresignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async uploadToS3(bookingItemId: number, files: Express.Multer.File[]) {
    let deliverable = await this.deliverableRepository.findOne({
      where: { bookingItemId },
    });

    if (!deliverable) {
      deliverable = this.deliverableRepository.create({
        bookingItemId,
        files: [],
        links: [],
      });
    }

    for (const file of files) {
      const key = `deliverable/${Date.now()}-${file.originalname}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const fileObject = {
        fileName: file.originalname,
        key,
      };

      deliverable.files = [...(deliverable.files || []), fileObject];
    }

    return this.deliverableRepository.save(deliverable);
  }

  async createLinks(bookingItemId: number, dto: CreateLinkDto) {
    let deliverable = await this.deliverableRepository.findOne({
      where: { bookingItemId },
    });

    if (!deliverable) {
      deliverable = this.deliverableRepository.create({
        bookingItemId,
        files: [],
        links: [],
      });
    }

    deliverable.links = [...(deliverable.links || []), ...dto.links];

    return this.deliverableRepository.save(deliverable);
  }

  async find(bookingItemId: number): Promise<Deliverable[]> {
    const deliverables = await this.deliverableRepository.find({
      where: { bookingItemId },
    });

    for (const deliverable of deliverables) {
      if (deliverable.files) {
        deliverable.files = await Promise.all(
          deliverable.files.map(async (f) => ({
            ...f,
            url: await this.generatePresignedUrl(f.key),
          })),
        );
      }
    }

    return deliverables;
  }

  async approve(bookingItemId: number) {
    const deliverables = await this.find(bookingItemId);

    for (const deliverable of deliverables) {
      if (!deliverable.approved) {
        deliverable.approved = true;
        await this.deliverableRepository.save(deliverable);
      }
    }
  }
}
