import TopBar from '@/components/layout/top-bar'
import { useMyPageQuery } from '@/hooks/queries/my'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/(authentication)/my/saved-storycards')({
  component: RouteComponent,
})

const SAVED_STORYCARDS = [
  {
    id: 1,
    placeName: '첨성대',
    subtitle: '별을 읽던 신라의 탑',
  },
  {
    id: 2,
    placeName: '첨성대',
    subtitle: '별을 읽던 신라의 탑',
  },
  {
    id: 3,
    placeName: '첨성대',
    subtitle: '별을 읽던 신라의 탑',
  },
  {
    id: 4,
    placeName: '첨성대',
    subtitle: '별을 읽던 신라의 탑',
  },
]

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const { data: myPage, isLoading } = useMyPageQuery()
  const savedStorycards =
    myPage?.savedStories.items.map((story, index) => {
      const fallback = SAVED_STORYCARDS.find((item) => item.id === story.storyId)

      return {
        id: story.storyId,
        imageUrl: story.imageUrl,
        placeName: fallback?.placeName ?? `스토리카드 ${index + 1}`,
        subtitle: fallback?.subtitle ?? '저장한 스토리카드',
      }
    }) ?? []
  const hasStorycards = savedStorycards.length > 0

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
            className="flex size-8 items-center justify-center rounded-full text-text-heading transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      {!isLoading && !hasStorycards ? (
        <main className="flex flex-1 items-center justify-center px-5 pb-24">
          <p className="text-center text-body1 text-text-default">
            저장한 스토리카드가 없습니다
          </p>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto px-5 pb-24 pt-4">
          <div className="flex flex-col gap-3">
            {savedStorycards.map((storycard) => (
              <article
                key={storycard.id}
                className="flex items-center px-2 py-3"
              >
                <div className="h-[100px] w-[77px] shrink-0 overflow-hidden rounded-[4px] bg-gray-300">
                  {storycard.imageUrl ? (
                    <img
                      src={storycard.imageUrl}
                      alt={storycard.placeName}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="ml-6 flex min-w-0 flex-col justify-center">
                  <h2 className="truncate text-title2 text-black">
                    {storycard.placeName}
                  </h2>
                  <p className="mt-2 truncate text-body1 text-black">
                    {storycard.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
