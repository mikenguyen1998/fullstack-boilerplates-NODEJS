import { SetMetadata } from '@nestjs/common';
import { SKIP_TRANSFORM_KEY } from '../constants';

/** Trả response "raw", không bọc {success,data,meta} (vd: health check, file download) */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
