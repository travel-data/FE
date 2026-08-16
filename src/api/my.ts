import { apiClient } from '@/lib/api-client'
import type { MyPageResponse } from '@/types/my'
import type { CommonResponse } from '@/types/response'

export async function getMyPage(): Promise<MyPageResponse> {
  const res =
    await apiClient.get<CommonResponse<MyPageResponse>>(
      '/api/v1/users/me/mypage',
    )

  return res.data.data
}
