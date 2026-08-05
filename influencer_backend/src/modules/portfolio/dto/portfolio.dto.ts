export class PortfolioDto {
  id: number;
  creatorId: number;
  url: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
