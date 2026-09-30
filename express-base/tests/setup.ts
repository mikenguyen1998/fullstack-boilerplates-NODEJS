// Test environment — set before any app module (and env validation) is imported.
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/express_base_test';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret-test-access-secret-0123456789';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-test-refresh-secret-0123456789';
process.env.DOCS_ENABLED = 'true';
