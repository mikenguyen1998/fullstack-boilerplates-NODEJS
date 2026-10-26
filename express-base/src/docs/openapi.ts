import { env } from '@/config/env.js';

/**
 * Hand-written OpenAPI 3.1 spec. Keep it next to the routes it documents
 * (or generate it from Zod with e.g. `zod-openapi` when the API grows).
 */
const json = (schema: object) => ({ content: { 'application/json': { schema } } });

export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Express Base API',
    version: '1.0.0',
    description:
      'Production-ready Express 5 + TypeScript boilerplate. Add `?lang=vi` or `Accept-Language: vi` for Vietnamese messages.',
  },
  servers: [{ url: env.API_PREFIX }],
  tags: [{ name: 'Health' }, { name: 'Users' }],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: ['string', 'null'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNextPage: { type: 'boolean' },
          hasPrevPage: { type: 'boolean' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          error: {
            type: 'object',
            properties: { code: { type: 'string' }, details: {} },
          },
          requestId: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Liveness probe (no DB)',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/health/ready': {
      get: {
        tags: ['Health'],
        summary: 'Readiness probe (checks DB)',
        responses: { 200: { description: 'Ready' }, 503: { description: 'Degraded' } },
      },
    },
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Create user',
        requestBody: {
          required: true,
          ...json({
            type: 'object',
            required: ['email'],
            properties: { email: { type: 'string', format: 'email' }, name: { type: 'string' } },
          }),
        },
        responses: {
          201: { description: 'Created' },
          409: { description: 'Email already exists' },
          422: { description: 'Validation error' },
        },
      },
      get: {
        tags: ['Users'],
        summary: 'List users',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['createdAt', 'email', 'name'] },
          },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { 200: { description: 'Paginated list' } },
      },
    },
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      get: {
        tags: ['Users'],
        summary: 'Get user',
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user',
        requestBody: {
          ...json({
            type: 'object',
            properties: {
              name: { type: 'string' },
              isActive: { type: 'boolean' },
            },
          }),
        },
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
      },
    },
  },
} as const;
