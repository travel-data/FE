import TopBar from '@/components/layout/top-bar'
import { useMyPageQuery } from '@/hooks/queries/my'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/(authentication)/my/memos')({
  component: RouteComponent,
})

const MEMOS = [
  {
    id: 1,
    courseId: '1',
    placeId: '101',
    placeName: '첨성대',
    category: '관광지',
    date: '2026.03.23',
    content:
      '본문을쓸 다날라마다해야 ㄷㄴㅏㅇ마밈라다리라리라ㅣ 더마다ㅣ 냐라마 그네 이거는 아마마다라며 ㅈ주 처리 처리 ㄷ며ㅏㅁ나 다ㅏ니 나니 3줄까지만나오게',
    images: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    id: 2,
    courseId: '1',
    placeId: '102',
    placeName: '첨성대',
    category: '관광지',
    date: '2026.03.23',
    content:
      '본문을쓸 다날라마다해야 ㄷㄴㅏㅇ마밈라다리라리라ㅣ 더마다ㅣ 냐라마 그네 이거는 아마마다라며 ㅈ주 처리 처리 ㄷ며ㅏㅁ나 다ㅏ니 나니 3줄까지만나오게',
    images: [],
  },
  {
    id: 3,
    courseId: '1',
    placeId: '103',
    placeName: '첨성대',
    category: '관광지',
    date: '2026.03.23',
    content:
      '본문을쓸 다날라마다해야 ㄷㄴㅏㅇ마밈라다리라리라ㅣ 더마다ㅣ 냐라마 그네 이거는 아마마다라며 ㅈ주 처리 처리 ㄷ며ㅏㅁ나 다ㅏ니 나니 3줄까지만나오게',
    images: [{ id: 1 }, { id: 2 }],
  },
]

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const { data: myPage, isLoading } = useMyPageQuery()
  const memos =
    myPage?.memos.items.map((memo) => ({
      id: memo.memoId,
      placeName: memo.courseTitle,
      category: '메모',
      date: '',
      content: memo.content,
      images: [],
      courseId: undefined,
      placeId: undefined,
    })) ?? MEMOS
  const hasMemos = memos.length > 0

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
        title="내가 작성한 메모"
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

      {!isLoading && !hasMemos ? (
        <main className="flex flex-1 items-center justify-center px-5 pb-24">
          <p className="text-center text-body1 text-text-default">
            작성한 메모가 없습니다
          </p>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto px-5 pb-24 pt-2">
          <div className="flex flex-col gap-3">
            {memos.map((memo) => (
              <button
                key={memo.id}
                type="button"
                onClick={() => {
                  if (!memo.courseId || !memo.placeId) return

                  navigate({
                    to: '/note/$courseId/place/$placeId/edit-memo',
                    params: {
                      courseId: memo.courseId,
                      placeId: memo.placeId,
                    },
                    search: {
                      from: 'mypage',
                    },
                  })
                }}
                className="rounded-[12px] bg-primary-50 px-3 py-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center">
                    <h2 className="truncate text-title3 text-black">
                      {memo.placeName}
                    </h2>
                    <span className="ml-2 shrink-0 rounded-[40px] bg-brand-primary px-3 py-1 text-caption text-primary-50">
                      {memo.category}
                    </span>
                  </div>

                  {memo.date ? (
                    <time className="shrink-0 text-caption text-text-subdued">
                      {memo.date}
                    </time>
                  ) : null}
                </div>

                <p className="mt-4 line-clamp-3 text-caption text-text-subdued">
                  {memo.content}
                </p>

                {memo.images.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {memo.images.map((image) => (
                      <div
                        key={image.id}
                        className="size-[120px] shrink-0 rounded-[4px] bg-white"
                        aria-label={`${memo.placeName} 메모 이미지 ${image.id}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
