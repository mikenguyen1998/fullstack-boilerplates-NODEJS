export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResponseMeta extends Partial<PaginationMeta> {
  timestamp: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta: ResponseMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  errors?: ApiErrorDetail[];
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}
