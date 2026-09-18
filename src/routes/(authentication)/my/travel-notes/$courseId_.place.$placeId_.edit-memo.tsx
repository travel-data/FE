import MemoEditor from '@/components/note/memo-editor'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authentication)/my/travel-notes/$courseId_/place/$placeId_/edit-memo',
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    category:
      search.category === 'RESTAURANT'
        ? ('RESTAURANT' as const)
        : search.category === 'ACCOMMODATION'
          ? ('ACCOMMODATION' as const)
          : ('TOUR_SPOT' as const),
  }),
})

function RouteComponent() {
  const navigate = useNavigate()
  const { courseId, placeId } = Route.useParams()
  const { category } = Route.useSearch()

  return (
    <MemoEditor
      spotId={Number(placeId)}
      category={category}
      onBack={() =>
        navigate({
          to: '/my/travel-notes/$courseId/place/$placeId',
          params: { courseId, placeId },
          search: { category },
          replace: true,
        })
      }
    />
  )
}
