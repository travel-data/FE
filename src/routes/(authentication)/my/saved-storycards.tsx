import TopBar from '@/components/layout/top-bar'
import { Button } from '@/components/ui/button'
import { useSavedStoryCardsInfiniteQuery } from '@/hooks/queries/story-card'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/(authentication)/my/saved-storycards')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSavedStoryCardsInfiniteQuery()
  const savedStoryCards = data?.pages.flatMap((page) => page.content) ?? []

  const handleBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: '/my' })
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title="저장한 스토리카드"
        leftSlot={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
            className="flex size-8 items-center justify-center rounded-full text-text-heading"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      {isLoading ? (
        <StatusMessage message="스토리카드를 불러오는 중입니다." />
      ) : isError ? (
        <StatusMessage
          message="저장한 스토리카드를 불러오지 못했습니다."
          error
        />
      ) : savedStoryCards.length === 0 ? (
        <StatusMessage message="저장한 스토리카드가 없습니다." />
      ) : (
        <main className="flex-1 overflow-y-auto px-5 pb-24 pt-4">
          <div className="flex flex-col gap-3">
            {savedStoryCards.map((storyCard) => (
              <button
                key={storyCard.storyId}
                type="button"
                onClick={() =>
                  navigate({
                    to: '/storycards/$spotId',
                    params: { spotId: String(storyCard.spotId) },
                  })
                }
                className="flex items-center px-2 py-3 text-left"
              >
                <div className="h-[100px] w-[77px] shrink-0 overflow-hidden rounded-[4px] bg-gray-300">
                  {storyCard.imageUrl ? (
                    <img
                      src={storyCard.imageUrl}
                      alt={storyCard.tourSpotName}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="ml-6 flex min-w-0 flex-col justify-center">
                  <h2 className="truncate text-title2 text-black">
                    {storyCard.tourSpotName}
                  </h2>
                  <p className="mt-2 truncate text-body1 text-black">
                    {storyCard.subTitle || storyCard.title}
                  </p>
                </div>
              </button>
            ))}

            {hasNextPage ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-2 w-full"
              >
                {isFetchingNextPage ? '불러오는 중' : '더 보기'}
              </Button>
            ) : null}
          </div>
        </main>
      )}
    </div>
  )
}

function StatusMessage({
  message,
  error = false,
}: {
  message: string
  error?: boolean
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 pb-24">
      <p
        className={
          error
            ? 'text-center text-body1 text-status-error'
            : 'text-center text-body1 text-text-default'
        }
      >
        {message}
      </p>
    </main>
  )
}
