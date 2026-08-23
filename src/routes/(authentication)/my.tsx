import BottomNavBar from '@/components/layout/bottom-nav-bar'
import TopBar from '@/components/layout/top-bar'
import { useMyPageQuery } from '@/hooks/queries/my'
import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { ChevronRight, Settings } from 'lucide-react'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/(authentication)/my')({
  component: RouteComponent,
})

const SAVED_STORYCARDS = [
  {
    id: 1,
    placeName: '첨성대',
    subtitle: '별을 읽던 신라의 밤',
  },
  {
    id: 2,
    placeName: '대릉원',
    subtitle: '고분 사이로 걷는 이야기',
  },
  {
    id: 3,
    placeName: '동궁과 월지',
    subtitle: '물빛에 남은 궁의 기억',
  },
  {
    id: 4,
    placeName: '황리단길',
    subtitle: '골목에서 만난 오늘',
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: myPage } = useMyPageQuery()

  const savedStories =
    myPage?.savedStories.items.map((story, index) => ({
      id: story.storyId,
      imageUrl: story.imageUrl,
      placeName:
        SAVED_STORYCARDS.find((item) => item.id === story.storyId)?.placeName ??
        `스토리카드 ${index + 1}`,
    })) ?? []

  if (location.pathname !== '/my') {
    return <Outlet />
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title="마이페이지"
        rightSlot={
          <button
            type="button"
            aria-label="설정"
            onClick={() => navigate({ to: '/settings' })}
            className="flex size-8 items-center justify-center rounded-full text-text-heading"
          >
            <Settings className="size-6" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-5 pb-24">
        <section className="mt-3 flex h-22 items-center py-2">
          <div className="size-18 shrink-0 overflow-hidden rounded-full border border-border-1 bg-gray-100">
            {myPage?.profile.profileImageUrl ? (
              <img
                src={myPage.profile.profileImageUrl}
                alt={myPage.profile.nickname}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <p className="ml-3 text-title3 font-medium text-text-heading">
            {myPage?.profile.nickname || '이름'}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-10">
          <SavedSection
            title="나의 여행 노트"
            count={0}
            emptyText="여행 노트가 없습니다"
            onClick={() => navigate({ to: '/my/travel-notes' })}
          />
          <SavedSection
            title="저장한 장소"
            count={myPage?.savedSpots.totalCount ?? 0}
            emptyText="저장한 장소가 없습니다"
            onClick={() => navigate({ to: '/my/saved-places' })}
          />
          <SavedSection
            title="저장한 스토리카드"
            count={myPage?.savedStories.totalCount ?? 0}
            emptyText="저장한 스토리카드가 없습니다"
            onClick={() => navigate({ to: '/my/saved-storycards' })}
          >
            {savedStories.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {savedStories.slice(0, 3).map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => navigate({ to: '/my/saved-storycards' })}
                    className="min-w-0 overflow-hidden rounded-[8px] bg-bg-card text-left"
                  >
                    <div className="aspect-[3/4] w-full bg-gray-100">
                      {story.imageUrl ? (
                        <img
                          src={story.imageUrl}
                          alt={story.placeName}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-body2 font-medium text-text-heading">
                        {story.placeName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : undefined}
          </SavedSection>
          <SavedSection
            title="내가 작성한 메모"
            count={myPage?.memos.totalCount ?? 0}
            emptyText="작성한 메모가 없습니다"
            onClick={() => navigate({ to: '/my/memos' })}
          />
        </div>
      </main>

      <BottomNavBar />
    </div>
  )
}

function SavedSection({
  title,
  count,
  emptyText,
  onClick,
  children,
}: {
  title: string
  count: number
  emptyText: string
  onClick: () => void
  children?: ReactNode
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-md bg-transparent text-left"
      >
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-title3 text-text-heading">{title}</h2>
          {count > 0 && (
            <span className="text-title3 text-text-subdued">{count}</span>
          )}
        </div>
        <ChevronRight className="size-4 text-text-heading" />
      </button>

      <div className="mt-5">
        {children ?? (
          <div className="flex min-h-20 items-center justify-center">
            <p className="text-center text-body1 text-text-default">
              {emptyText}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
