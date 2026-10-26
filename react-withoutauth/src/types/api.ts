export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

/** Shape of error bodies returned by the backend (adjust to your API). */
export interface ApiErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}
