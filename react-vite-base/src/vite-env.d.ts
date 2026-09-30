/// <reference types="vite/client" />

interface ViteTypeOptions {
  // Make `import.meta.env` strict: unknown keys become a type error.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_DEFAULT_LANGUAGE?: 'en' | 'vi';
  readonly VITE_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
