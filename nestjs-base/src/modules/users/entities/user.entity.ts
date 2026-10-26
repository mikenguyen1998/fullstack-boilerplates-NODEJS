import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities';

@Entity({ name: 'users' })
@Index('UQ_users_email', ['email'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class User extends BaseEntity {
  @ApiProperty({ example: 'john@example.com' })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
