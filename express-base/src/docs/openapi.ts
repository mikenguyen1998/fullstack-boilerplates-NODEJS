import { env } from '@/config/env.js';

/**
 * Hand-written OpenAPI 3.1 spec. Keep it next to the routes it documents
 * (or generate it from Zod with e.g. `zod-openapi` when the API grows).
 */
const errorResponse = { $ref: '#/components/schemas/ErrorResponse' };
const bearer = [{ bearerAuth: [] }];
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
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Users' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: ['string', 'null'] },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
          isActive: { type: 'boolean' },
          lastLoginAt: { type: ['string', 'null'], format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Tokens: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          tokenType: { type: 'string', example: 'Bearer' },
          expiresIn: { type: 'string', example: '15m' },
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
      RegisterBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, example: 'Passw0rd!' },
          name: { type: 'string' },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
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
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new account',
        requestBody: { required: true, ...json({ $ref: '#/components/schemas/RegisterBody' }) },
        responses: {
          201: { description: 'Created' },
          409: { description: 'Email taken', ...json(errorResponse) },
          422: { description: 'Validation error', ...json(errorResponse) },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email & password',
        requestBody: { required: true, ...json({ $ref: '#/components/schemas/LoginBody' }) },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Invalid credentials', ...json(errorResponse) },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Exchange a refresh token for new tokens',
        requestBody: {
          required: true,
          ...json({
            type: 'object',
            required: ['refreshToken'],
            properties: { refreshToken: { type: 'string' } },
          }),
        },
        responses: {
          200: { description: 'OK', ...json({ $ref: '#/components/schemas/Tokens' }) },
          401: { description: 'Invalid token', ...json(errorResponse) },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current user',
        security: bearer,
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized', ...json(errorResponse) },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (ADMIN)',
        security: bearer,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['USER', 'ADMIN'] } },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['createdAt', 'email', 'name'] },
          },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { 200: { description: 'Paginated list' }, 403: { description: 'Forbidden' } },
      },
    },
    '/users/{id}': {
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      get: {
        tags: ['Users'],
        summary: 'Get user (ADMIN)',
        security: bearer,
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user (ADMIN)',
        security: bearer,
        requestBody: {
          ...json({
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: 'string', enum: ['USER', 'ADMIN'] },
              isActive: { type: 'boolean' },
            },
          }),
        },
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user (ADMIN)',
        security: bearer,
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
      },
    },
  },
} as const;
