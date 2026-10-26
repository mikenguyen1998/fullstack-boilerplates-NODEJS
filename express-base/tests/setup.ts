// Test environment — set before any app module (and env validation) is imported.
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/express_base_test';
process.env.DOCS_ENABLED = 'true';
