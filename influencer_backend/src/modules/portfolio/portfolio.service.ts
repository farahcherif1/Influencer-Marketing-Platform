import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PortfolioDto } from './dto/portfolio.dto';

@Injectable()
export class PortfolioService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET;

  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadToS3(creatorId: number, files: Express.Multer.File[]) {
    const uploadedItems = await Promise.all(
      files.map(async (file) => {
        const key = `portfolio/${Date.now()}-${file.originalname}`;

        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        const portfolio = this.portfolioRepository.create({
          creatorId,
          // url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          url: '',
          s3Key: key,
        });
        const saved = await this.portfolioRepository.save(portfolio);
        const signedUrl = await getSignedUrl(
          this.s3,
          new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          }),
          { expiresIn: 3600 },
        );

        return { ...saved, url: signedUrl };
      }),
    );

    return uploadedItems;
  }

  async findAllByCreator(creatorId: number): Promise<PortfolioDto[]> {
    const portfolios = await this.portfolioRepository.find({
      where: { creatorId },
    });
    const result = await Promise.all(
      portfolios.map(async (p) => {
        if (!p.s3Key) return null;
        const signedUrl = await getSignedUrl(
          this.s3,
          new GetObjectCommand({
            Bucket: this.bucketName,
            Key: p.s3Key,
          }),
          { expiresIn: 3600 }, // 1 hour
        );
        return {
          id: p.id,
          creatorId: p.creatorId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          s3Key: p.s3Key,
          url: signedUrl,
        };
      }),
    );
    return result.filter((item) => item !== null);
  }

  async findOneByCreator(creatorId: number, id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, creatorId },
    });
    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with ID ${id} not found for this creator`,
      );
    }
    if (portfolio.s3Key) {
      portfolio.url = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: portfolio.s3Key,
        }),
        { expiresIn: 3600 },
      );
    }

    return portfolio;
  }

  async removeFromS3(creatorId: number, id: number) {
    const item = await this.portfolioRepository.findOne({
      where: { id, creatorId },
    });
    if (!item) throw new NotFoundException('Portfolio item not found');

    if (item.s3Key) {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: item.s3Key,
        }),
      );
    }

    return this.portfolioRepository.remove(item);
  }
}
