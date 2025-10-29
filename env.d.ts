/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // ← tu endpoint base del backend
  readonly VITE_APP_NAME?: string; // opcional, si tienes el nombre de la app
  readonly VITE_ENV?: string; // opcional, para desarrollo/producción
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}