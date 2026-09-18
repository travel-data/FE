import MemoEditor from '@/components/note/memo-editor'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authentication)/note/$courseId_/place/$placeId_/edit-memo',
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    from: (search.from as string) || undefined,
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
  const router = useRouter()
  const { courseId, placeId } = Route.useParams()
  const search = Route.useSearch()

  const handleBack = () => {
    if (search.from === 'mypage') {
      if (router.history.canGoBack()) {
        router.history.back()
        return
      }

      navigate({ to: '/my/memos' })
      return
    }

    navigate({
      to: '/note/$courseId/place/$placeId',
      params: { courseId, placeId },
    })
  }

  return (
    <MemoEditor
      spotId={Number(placeId)}
      category={search.category}
      onBack={handleBack}
    />
  )
}
