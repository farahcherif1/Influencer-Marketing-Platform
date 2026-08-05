import { Creator } from '../../modules/creator/entities/creator.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  name: string; // e.g. "English", "French", "Arabic"

  @Column({ nullable: true })
  code?: string; //(e.g. "en", "fr", "ar")

  @ManyToMany(() => Creator, (creator) => creator.languages)
  creators: Creator[];
}
