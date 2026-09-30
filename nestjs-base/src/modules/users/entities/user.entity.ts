import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { Role } from '../../../common/enums';
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

  @Exclude()
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Exclude()
  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  refreshTokenHash?: string | null;

  @ApiPropertyOptional()
  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt?: Date | null;
}
