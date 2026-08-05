import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { MediaType } from '../../common/enums/mediaType.enum';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://signed-url.com/file'),
}));

describe('MediaService', () => {
  let service: MediaService;
  let mediaRepo: Partial<Record<keyof Repository<Media>, jest.Mock>>;
  let s3ClientMock: jest.Mocked<S3Client>;

  const mockMediaArray: Media[] = [
    {
      id: 1,
      creatorId: 1,
      url: 'url1',
      s3Key: 'key1',
      type: MediaType.PROFILE_PICTURE,
      creator: {} as any,
    } as Media,
    {
      id: 2,
      creatorId: 1,
      url: 'url2',
      s3Key: 'key2',
      type: MediaType.OTHER,
      creator: {} as any,
    } as Media,
  ];

  beforeEach(async () => {
    process.env.AWS_S3_BUCKET = 'test-bucket';
    process.env.AWS_REGION = 'eu-north-1';

    mediaRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(Media),
          useValue: mediaRepo,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    s3ClientMock = (service as any).s3;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadToS3', () => {
    it('should upload files, save media, and generate presigned URLs', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('mock data'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const createdMedia = {
        id: 1,
        creatorId: 1,
        url: 'initial-url',
        s3Key: 'some-key',
        type: MediaType.PROFILE_PICTURE,
        creator: {} as any,
      } as Media;

      (mediaRepo.create as jest.Mock).mockReturnValue(createdMedia);
      (mediaRepo.save as jest.Mock).mockResolvedValue(createdMedia);
      (s3ClientMock.send as jest.Mock).mockResolvedValue({});

      const result = await service.uploadToS3(1, MediaType.PROFILE_PICTURE, [
        mockFile,
      ]);

      expect(mediaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          creatorId: 1,
          url: expect.stringContaining('https://'),
          s3Key: expect.stringContaining('media/'),
          type: MediaType.PROFILE_PICTURE,
        }),
      );

      expect(mediaRepo.save).toHaveBeenCalledWith(createdMedia);
      expect(getSignedUrl).toHaveBeenCalled(); // presigned URL is generated
      expect(result[0].url).toBe('https://signed-url.com/file'); // url replaced by signed URL
    });
  });

  describe('findAll', () => {
    it('should return all media with presigned URLs when no creatorId is provided', async () => {
      (mediaRepo.find as jest.Mock).mockResolvedValue(mockMediaArray);

      const result = await service.findAll(); // no creatorId passed
      expect(mediaRepo.find).toHaveBeenCalledWith({ where: {} }); // no filter
      expect(getSignedUrl).toHaveBeenCalledTimes(mockMediaArray.length);
      expect(result[0].url).toBe('https://signed-url.com/file');
      expect(result[1].url).toBe('https://signed-url.com/file');
    });

    it('should return media filtered by creatorId with presigned URLs', async () => {
      const creatorId = 1;
      (mediaRepo.find as jest.Mock).mockResolvedValue(mockMediaArray);

      const result = await service.findAll(creatorId);
      expect(mediaRepo.find).toHaveBeenCalledWith({ where: { creatorId } }); // filtered
      expect(getSignedUrl).toHaveBeenCalledTimes(mockMediaArray.length);
      expect(result[0].url).toBe('https://signed-url.com/file');
      expect(result[1].url).toBe('https://signed-url.com/file');
    });
  });
  describe('findOne', () => {
    it('should return media with presigned URL if found', async () => {
      (mediaRepo.findOne as jest.Mock).mockResolvedValue(mockMediaArray[0]);

      const result = await service.findOne(1);

      expect(mediaRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(getSignedUrl).toHaveBeenCalled();
      expect(result.url).toBe('https://signed-url.com/file');
    });

    it('should throw NotFoundException if not found', async () => {
      (mediaRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      expect(mediaRepo.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
    });
  });

  describe('removeFromS3', () => {
    it('should remove media from S3 and DB', async () => {
      const mediaItem = mockMediaArray[0];

      (mediaRepo.findOne as jest.Mock).mockResolvedValue(mediaItem);
      (mediaRepo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      (s3ClientMock.send as jest.Mock).mockResolvedValue({});

      const result = await service.removeFromS3(1);

      expect(mediaRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand),
      );
      expect(mediaRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if media not found', async () => {
      (mediaRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeFromS3(99)).rejects.toThrow(NotFoundException);
      expect(mediaRepo.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
    });
  });
});
