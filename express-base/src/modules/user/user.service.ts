import { prisma } from '@/database/index.js';
import type { Prisma } from '@/generated/prisma/client.js';
import { HttpError } from '@/utils/errors.js';
import { buildPaginationMeta, getPagination } from '@/utils/pagination.js';

import type { CreateUserBody, ListUsersQuery, UpdateUserBody } from './user.schema.js';

/** Fields returned by the user API. */
export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

export const userService = {
  async create(data: CreateUserBody): Promise<PublicUser> {
    return prisma.user.create({ data, select: publicUserSelect });
  },

  async list(query: ListUsersQuery) {
    const where: Prisma.UserWhereInput = {
      ...(query.search
        ? {
            OR: [
              { email: { contains: query.search, mode: 'insensitive' } },
              { name: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: publicUserSelect,
        orderBy: { [query.sortBy]: query.sortOrder },
        ...getPagination(query),
      }),
      prisma.user.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(total, query.page, query.limit) };
  },

  async getById(id: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { id }, select: publicUserSelect });
    if (!user) throw HttpError.notFound('user.notFound');
    return user;
  },

  async update(id: string, data: UpdateUserBody): Promise<PublicUser> {
    await this.getById(id);
    return prisma.user.update({ where: { id }, data, select: publicUserSelect });
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await prisma.user.delete({ where: { id } });
  },
};
