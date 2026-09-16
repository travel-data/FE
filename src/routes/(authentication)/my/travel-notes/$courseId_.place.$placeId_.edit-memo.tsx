import MemoEditor from '@/components/note/memo-editor'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authentication)/my/travel-notes/$courseId_/place/$placeId_/edit-memo',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { courseId, placeId } = Route.useParams()

  return (
    <MemoEditor
      spotId={Number(placeId)}
      onBack={() =>
        navigate({
          to: '/my/travel-notes/$courseId/place/$placeId',
          params: { courseId, placeId },
          search: { category: 'TOUR_SPOT' },
          replace: true,
        })
      }
    />
  )
}
