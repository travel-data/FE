import TopBar from '@/components/layout/top-bar'
import { Button } from '@/components/ui/button'
import { useMemoListInfiniteQuery } from '@/hooks/queries/memo'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { placeCategoryLabel } from '@/lib/format-course'

export const Route = createFileRoute('/(authentication)/my/memos')({
  component: RouteComponent,
})

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\. /g, '.')
    .replace(/\.$/, '')
}

function RouteComponent() {
  const { t } = useTranslation(['my', 'place', 'common'])
  const router = useRouter()
  const navigate = useNavigate()
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMemoListInfiniteQuery()
  const memos = data?.pages.flatMap((page) => page.content) ?? []

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
        title={t('memo.title')}
        leftSlot={
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={handleBack}
            className="flex size-8 items-center justify-center rounded-full text-text-heading"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-body1 text-text-default">
              메모를 불러오는 중입니다.
            </p>
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-body1 text-status-error">
              메모 목록을 불러오지 못했습니다.
            </p>
          </div>
        ) : memos.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-body1 text-text-default">
              {t('memo.empty_title')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {memos.map((memo) => (
              <button
                key={memo.memoId}
                type="button"
                onClick={() =>
                  navigate({
                    to: '/note/$courseId/place/$placeId/edit-memo',
                    params: {
                      courseId: 'memo',
                      placeId: String(
                        memo.category === 'TOUR_SPOT'
                          ? memo.spotId
                          : memo.nearbyPlaceId,
                      ),
                    },
                    search: { from: 'mypage', category: memo.category },
                  })
                }
                className="rounded-[12px] bg-primary-50 px-3 py-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center">
                    <h2 className="truncate text-title3 text-black">
                      {memo.spotName}
                    </h2>
                    <span className="ml-2 shrink-0 rounded-[40px] bg-brand-primary px-3 py-1 text-caption text-primary-50">
                      {placeCategoryLabel(memo.category)}
                    </span>
                  </div>

                  <time className="shrink-0 text-caption text-text-subdued">
                    {formatDate(memo.updatedAt)}
                  </time>
                </div>

                <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-caption text-text-subdued">
                  {memo.content}
                </p>

                {memo.imageUrl ? (
                  <img
                    src={memo.imageUrl}
                    alt={`${memo.spotName} 메모 이미지`}
                    className="mt-3 h-[120px] w-[120px] rounded-[4px] object-cover"
                  />
                ) : null}
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
                {isFetchingNextPage
                  ? t('common:button.loading')
                  : t('common:button.load_more')}
              </Button>
            ) : null}
          </div>
        )}
      </main>
    </div>
  )
}
