/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_GARDEN: string
  readonly VITE_ENABLE_COLLABORATION: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_FEEDBACK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
