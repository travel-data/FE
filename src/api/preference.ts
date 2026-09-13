import { apiClient } from '@/lib/api-client'
import type {
  UserPreferenceRequest,
  UserPreferenceResponse,
} from '@/types/preference'
import type { CommonResponse } from '@/types/response'

export async function saveUserPreferences(body: UserPreferenceRequest) {
  const res = await apiClient.patch<CommonResponse<UserPreferenceResponse>>(
    '/api/v1/users/me/preferences',
    body,
  )

  return res.data.data
}
