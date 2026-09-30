import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity as TypeOrmBaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entity gốc cho mọi bảng: id (uuid), createdAt, updatedAt, deletedAt (soft delete).
 * Lưu ý: `timestamptz` là kiểu của PostgreSQL. Nếu đổi sang MySQL/MariaDB hãy dùng
 * `timestamp`/`datetime`; MSSQL: `datetime2`; SQLite: `datetime`.
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiProperty({ nullable: true, required: false })
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
