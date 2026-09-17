const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as
  | string
  | undefined
const configuredRecommendationApiBaseUrl = import.meta.env
  .VITE_RECOMMENDATION_API_BASE_URL as string | undefined

export const API_BASE_URL = import.meta.env.PROD
  ? ''
  : (configuredApiBaseUrl ?? '')

export const RECOMMENDATION_API_BASE_URL = import.meta.env.PROD
  ? ''
  : (configuredRecommendationApiBaseUrl ?? '').replace(/\/+$/, '')
