import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { paginate } from '../utils';
import { TransformResponseInterceptor } from './transform-response.interceptor';

const ctx = {
  getType: () => 'http',
  getHandler: () => () => undefined,
  getClass: () => class {},
  switchToHttp: () => ({ getRequest: () => ({ id: 'req-1' }) }),
} as unknown as ExecutionContext;

const handler = (value: unknown): CallHandler => ({ handle: () => of(value) });

describe('TransformResponseInterceptor', () => {
  const interceptor = new TransformResponseInterceptor(new Reflector());

  it('wraps plain data into {success,data,meta}', async () => {
    const res = await firstValueFrom(
      interceptor.intercept(ctx, handler({ foo: 'bar' })),
    );
    expect(res).toMatchObject({
      success: true,
      data: { foo: 'bar' },
      meta: { requestId: 'req-1' },
    });
  });

  it('moves pagination info into meta', async () => {
    const res = await firstValueFrom(
      interceptor.intercept(ctx, handler(paginate([1, 2], 12, 1, 2))),
    );
    expect(res).toMatchObject({
      success: true,
      data: [1, 2],
      meta: { page: 1, limit: 2, total: 12, totalPages: 6 },
    });
  });
});
