import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

// Mock getSignedUrl globally
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('PortfolioService', () => {
  let service: PortfolioService;
  let portfolioRepo: Partial<Record<keyof Repository<Portfolio>, jest.Mock>>;
  let s3ClientMock: jest.Mocked<S3Client>;

  const mockPortfolioArray: Portfolio[] = [
    {
      id: 1,
      creatorId: 1,
      url: '',
      s3Key: 'key1',
      creator: {} as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Portfolio,
    {
      id: 2,
      creatorId: 1,
      url: '',
      s3Key: 'key2',
      creator: {} as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Portfolio,
  ];

  beforeEach(async () => {
    portfolioRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: getRepositoryToken(Portfolio),
          useValue: portfolioRepo,
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    s3ClientMock = (service as any).s3;

    (getSignedUrl as jest.Mock).mockResolvedValue(
      'https://signed-url.com/test.jpg',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadToS3', () => {
    it('should upload files and return saved portfolios with presigned URLs', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('mock data'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const savedPortfolio = {
        ...mockPortfolioArray[0],
        s3Key: 'portfolio/test.jpg',
        url: '',
      };

      (portfolioRepo.create as jest.Mock).mockReturnValue(savedPortfolio);
      (portfolioRepo.save as jest.Mock).mockResolvedValue(savedPortfolio);
      (s3ClientMock.send as jest.Mock).mockResolvedValue({});

      const result = await service.uploadToS3(1, [mockFile]);

      expect(portfolioRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          creatorId: 1,
          url: '',
          s3Key: expect.stringContaining('portfolio/'),
        }),
      );
      expect(portfolioRepo.save).toHaveBeenCalledWith(savedPortfolio);
      expect(result[0].url).toBe('https://signed-url.com/test.jpg');
    });
  });

  describe('findAllByCreator', () => {
    it('should return portfolios with presigned URLs', async () => {
      portfolioRepo.find!.mockResolvedValue(mockPortfolioArray);

      const result = await service.findAllByCreator(1);

      expect(portfolioRepo.find).toHaveBeenCalledWith({
        where: { creatorId: 1 },
      });
      expect(getSignedUrl).toHaveBeenCalledTimes(mockPortfolioArray.length);
      expect(result[0].url).toBe('https://signed-url.com/test.jpg');
    });
  });

  describe('findOneByCreator', () => {
    it('should return the portfolio with presigned URL', async () => {
      const expected = mockPortfolioArray[0];
      portfolioRepo.findOne!.mockResolvedValue(expected);

      const result = await service.findOneByCreator(1, 1);

      expect(portfolioRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, creatorId: 1 },
      });
      expect(getSignedUrl).toHaveBeenCalled();
      expect(result.url).toBe('https://signed-url.com/test.jpg');
    });

    it('should throw NotFoundException if not found', async () => {
      portfolioRepo.findOne!.mockResolvedValue(null);

      await expect(service.findOneByCreator(1, 99)).rejects.toThrow(
        NotFoundException,
      );
      expect(portfolioRepo.findOne).toHaveBeenCalledWith({
        where: { id: 99, creatorId: 1 },
      });
    });
  });

  describe('removeFromS3', () => {
    it('should delete the portfolio from S3 and DB', async () => {
      const portfolioItem = mockPortfolioArray[0];

      (portfolioRepo.findOne as jest.Mock).mockResolvedValue(portfolioItem);
      (portfolioRepo.remove as jest.Mock).mockResolvedValue(portfolioItem);
      (s3ClientMock.send as jest.Mock).mockResolvedValue({});

      const result = await service.removeFromS3(1, 1);

      expect(portfolioRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, creatorId: 1 },
      });
      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand),
      );
      expect(portfolioRepo.remove).toHaveBeenCalledWith(portfolioItem);
      expect(result).toEqual(portfolioItem);
    });

    it('should throw NotFoundException if portfolio not found', async () => {
      (portfolioRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeFromS3(1, 99)).rejects.toThrow(
        NotFoundException,
      );
      expect(portfolioRepo.findOne).toHaveBeenCalledWith({
        where: { id: 99, creatorId: 1 },
      });
    });
  });
});
