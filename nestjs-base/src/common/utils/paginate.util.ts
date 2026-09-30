import { Paginated } from '../interfaces';

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): Paginated<T> {
  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    },
  };
}

export function isPaginated(value: unknown): value is Paginated<unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<Paginated<unknown>>;
  return (
    Array.isArray(v.items) &&
    !!v.meta &&
    typeof v.meta === 'object' &&
    typeof v.meta.total === 'number'
  );
}
