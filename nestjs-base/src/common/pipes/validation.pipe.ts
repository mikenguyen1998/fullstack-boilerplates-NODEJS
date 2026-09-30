import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ApiErrorDetail } from '../interfaces';

function flatten(errors: ValidationError[], parent = ''): ApiErrorDetail[] {
  return errors.flatMap((err) => {
    const field = parent ? `${parent}.${err.property}` : err.property;
    const own = Object.values(err.constraints ?? {}).map((message) => ({
      field,
      message,
    }));
    return [...own, ...flatten(err.children ?? [], field)];
  });
}

/**
 * ValidationPipe GLOBAL:
 * - whitelist: loại bỏ field không khai báo trong DTO
 * - forbidNonWhitelisted: báo lỗi nếu client gửi field lạ
 * - transform: tự convert payload sang instance DTO (và kiểu primitive)
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    stopAtFirstError: false,
    exceptionFactory: (errors) =>
      new BadRequestException({
        message: 'common.VALIDATION_FAILED',
        errors: flatten(errors),
      }),
  });
}
