import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableService } from './deliverable.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// --- Fix S3Client mock: make it class-like ---
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(function () {
      this.send = jest.fn().mockResolvedValue({});
    }),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://signed-url.com'),
}));

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('DeliverableService', () => {
  let service: DeliverableService;
  let repo: MockRepo<Deliverable>;
  let s3Client: jest.Mocked<S3Client>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliverableService,
        {
          provide: getRepositoryToken(Deliverable),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<DeliverableService>(DeliverableService);
    s3Client = (service as any).s3;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadToS3', () => {
    it('should upload files, save deliverable, and return entity with keys', async () => {
      const fakeFile = {
        originalname: 'test.png',
        buffer: Buffer.from('file'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      // --- Fix: repo.create should return the DTO, not a hardcoded id ---
      (repo.findOne as jest.Mock).mockResolvedValue(null); // no existing deliverable
      (repo.create as jest.Mock).mockImplementation((dto) => dto);
      (repo.save as jest.Mock).mockImplementation((dto) => ({
        ...dto,
        id: 1,
        files: dto.files.map((f: { fileName: string }) => ({
          ...f,
          key: `deliverable/${Date.now()}-${f.fileName}`,
        })),
      }));

      const result = await service.uploadToS3(123, [fakeFile]);

      expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          bookingItemId: 123,
          files: [expect.objectContaining({ fileName: 'test.png' })],
        }),
      );
      expect(result.files?.[0]).toHaveProperty('key');
    });
  });

  describe('createLinks', () => {
    it('should create and save a deliverable with links', async () => {
      const dto = { links: ['https://example.com'] };

      (repo.findOne as jest.Mock).mockResolvedValue(null);
      (repo.create as jest.Mock).mockImplementation((data) => data);
      (repo.save as jest.Mock).mockImplementation((data) => ({
        ...data,
        id: 1,
      }));

      const result = await service.createLinks(456, dto);

      expect(repo.create).toHaveBeenCalledWith({
        bookingItemId: 456,
        files: [],
        links: ['https://example.com'],
      });
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          links: dto.links,
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({ id: 1, links: dto.links }),
      );
    });
  });
  
  describe('find', () => {
    it('should return deliverables with presigned URLs', async () => {
      const deliverables = [
        {
          id: 1,
          bookingItemId: 789,
          files: [{ fileName: 'cat.jpg', key: 'deliverable/cat.jpg' }],
        },
      ] as Deliverable[];

      (repo.find as jest.Mock).mockResolvedValue(deliverables);

      const result = await service.find(789);

      expect(repo.find).toHaveBeenCalledWith({
        where: { bookingItemId: 789 },
      });
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        expect.any(Object),
      );
      expect(result[0]?.files?.[0]).toHaveProperty(
        'url',
        'https://signed-url.com',
      );
    });
  });
});
