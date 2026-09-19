import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authentication)/note/$courseId_/place/$placeId',
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/my/travel-notes/$courseId/place/$placeId',
      params: {
        courseId: params.courseId,
        placeId: params.placeId,
      },
      search: { category: 'TOUR_SPOT' },
      replace: true,
    })
  },
})
