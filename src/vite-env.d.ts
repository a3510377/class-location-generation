/// <reference types="vite/client" />

interface ImportMetaEnv {
  API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
