/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COINGECKO_API_KEY: string;
  readonly VITE_COINGECKO_COINS_LIST_URL: string;
  readonly VITE_REOWN_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
