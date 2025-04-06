/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COINGECKO_API_KEY: string;
  readonly VITE_COINGECKO_COINS_LIST_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
