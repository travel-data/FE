import TopBar from '@/components/layout/top-bar'
import { deleteSavedTourSpot } from '@/api/tour-spot'
import { useMyPageQuery } from '@/hooks/queries/my'
import { QUERY_KEY } from '@/constants/query-key'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/(authentication)/my/saved-places')({
  component: RouteComponent,
})

const SAVED_PLACES = [
  {
    id: 1,
    name: '첨성대',
    category: '관광지',
    address: '경상북도 경주시 인왕동 839-1',
  },
  {
    id: 2,
    name: '동궁과 월지',
    category: '관광지',
    address: '경상북도 경주시 원화로 102',
  },
  {
    id: 3,
    name: '황리단길',
    category: '거리',
    address: '경상북도 경주시 포석로 일대',
  },
]

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: myPage, isLoading } = useMyPageQuery()
  const savedPlaces = myPage?.savedSpots.items.map((spot) => {
    const fallback = SAVED_PLACES.find((place) => place.id === spot.spotId)

    return {
      id: spot.spotId,
      imageUrl: spot.imageUrl,
      name: fallback?.name ?? `관광지 ${spot.spotId}`,
      category: fallback?.category ?? '관광지',
      address: fallback?.address ?? '주소 정보가 제공되지 않았습니다',
    }
  }) ?? SAVED_PLACES.map((place) => ({ ...place, imageUrl: '' }))

  const deleteMutation = useMutation({
    mutationFn: deleteSavedTourSpot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
    },
  })

  const handleBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: '/my' })
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title="저장한 장소"
        leftSlot={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
            className="flex size-8 items-center justify-center rounded-full text-text-heading transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      <main className="mt-2 flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-24">
        {!isLoading && savedPlaces.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-body1 text-text-default">
              저장한 장소가 없습니다
            </p>
          </div>
        ) : null}

        {savedPlaces.map((place) => (
          <article
            key={place.id}
            className="flex items-center rounded-[8px] bg-primary-50 p-3"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="min-w-0 truncate text-title3 font-medium text-text-heading">
                  {place.name}
                </h2>
                <span className="shrink-0 rounded-[40px] bg-brand-primary px-3 py-1 text-caption text-primary-50">
                  {place.category}
                </span>
              </div>

              <p className="mt-2 min-w-0 truncate text-caption text-text-subdued">
                {place.address}
              </p>
            </div>

            <div className="ml-3 size-[72px] shrink-0 overflow-hidden rounded-[8px] bg-white">
              {place.imageUrl ? (
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => handleDelete(place.id)}
              aria-label="삭제"
              disabled={deleteMutation.isPending}
              className="ml-5 flex size-6 shrink-0 items-center justify-center text-text-subdued transition-colors hover:text-text-heading disabled:opacity-40"
            >
              <Trash2 className="size-6" />
            </button>
          </article>
        ))}
      </main>
    </div>
  )
}
