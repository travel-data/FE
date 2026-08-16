const PRODUCTION_API_BASE_URL = 'https://oiso.duckdns.org'
const LOCAL_API_BASE_URL = 'http://localhost:8080'
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as
  | string
  | undefined
const isLocalApiBaseUrl =
  configuredApiBaseUrl?.includes('localhost') ||
  configuredApiBaseUrl?.includes('127.0.0.1')

export const API_BASE_URL =
  import.meta.env.PROD && isLocalApiBaseUrl
    ? PRODUCTION_API_BASE_URL
    : configuredApiBaseUrl ??
      (import.meta.env.PROD ? PRODUCTION_API_BASE_URL : LOCAL_API_BASE_URL)
