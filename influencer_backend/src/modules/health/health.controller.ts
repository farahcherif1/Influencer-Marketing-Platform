import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('healthCheck')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    try {
      await this.health.check([
        () => this.db.pingCheck('database'),
        () =>
          this.http.pingCheck(
            'frontend',
            this.configService.get<string>('VITE_APP_BASE_URL', ''),
          ),
      ]);
      return { status: 'up' };
    } catch {
      return { status: 'down' };
    }
  }
}