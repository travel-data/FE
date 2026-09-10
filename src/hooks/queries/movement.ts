import { useQuery } from '@tanstack/react-query'
import { calculateRoute } from '@/api/movement'
import { QUERY_KEY } from '@/constants/query-key'
import type { RouteCalculationRequest } from '@/types/route'

export function useRouteCalculation(
  body: RouteCalculationRequest,
  { enabled = true } = {},
) {
  return useQuery({
    queryKey: QUERY_KEY.route.calculate({
      origin: body.origin,
      destination: body.destination,
      transportType: body.transportType,
    }),
    queryFn: () => calculateRoute(body),
    enabled,
    staleTime: Infinity,
  })
}
