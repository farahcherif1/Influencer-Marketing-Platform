import { Entity, Column, OneToMany, Index } from 'typeorm';
import { CreatorService } from '../../creator-service/entities/creator-service.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentType } from '../../../common/enums/contentType.enum';
@Entity()
@Index('idx_service_platform', ['platform'])
@Index('idx_service_name', ['name'])
export class Service extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column({ type: 'enum', enum: ContentType })
  @Index()
  platform: ContentType;

  @Column({ type: 'boolean', default: false })
  hasDuration: boolean;

  @OneToMany(() => CreatorService, (cs) => cs.service)
  creatorServices: CreatorService[];
}
