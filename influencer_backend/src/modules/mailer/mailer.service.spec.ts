import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const mockEnv: { [key: string]: string | number } = {
                MAIL_HOST: 'smtp.example.com',
                MAIL_PORT: 587,
                MAIL_USER: 'user@example.com',
                MAIL_PASSWORD: 'password',
                APP_NAME: 'MyApp',
              };
              return mockEnv[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
