import { apiClient } from '@/lib/api-client'
import { CommonResponse } from '@/types/response'
import {
  RouteCalculationRequest,
  RouteCalculationResponse,
} from '@/types/route'

export const calculateRoute = async (body: RouteCalculationRequest) => {
  const res = await apiClient.post<CommonResponse<RouteCalculationResponse>>(
    '/api/v1/routes/calculate',
    body,
  )

  return res.data.data
}
