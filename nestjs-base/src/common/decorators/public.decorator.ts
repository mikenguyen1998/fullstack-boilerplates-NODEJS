import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

/** Bỏ qua JwtAuthGuard (global) cho route / controller này */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
