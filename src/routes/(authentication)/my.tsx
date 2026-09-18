import BottomNavBar from '@/components/layout/bottom-nav-bar'
import TopBar from '@/components/layout/top-bar'
import NoteCourseCard from '@/components/note/note-course-card'
import { Spinner } from '@/components/ui/spinner'
import { useGetCourseList } from '@/hooks/queries/course'
import { useMemoListInfiniteQuery } from '@/hooks/queries/memo'
import { useMyPageQuery } from '@/hooks/queries/my'
import { useSavedPlacesQuery } from '@/hooks/queries/place'
import { useSavedStoryCardsInfiniteQuery } from '@/hooks/queries/story-card'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import { getPlaceId } from '@/types/place'
import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { ChevronRight, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  formatCourseDateRange,
  formatCourseDistance,
  formatCourseDuration,
  placeCategoryLabel,
} from '@/lib/format-course'

export const Route = createFileRoute('/(authentication)/my')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation(['my', 'common'])
  const navigate = useNavigate()
  const location = useLocation()
  const openPlaceDetail = usePlaceDetailSheetStore((state) => state.open)
  const { data: myPage } = useMyPageQuery()
  const { data: courseList, isLoading: areCoursesLoading } = useGetCourseList()
  const { data: savedPlaceList, isLoading: areSavedPlacesLoading } =
    useSavedPlacesQuery()
  const { data: savedStoryPages, isLoading: areSavedStoriesLoading } =
    useSavedStoryCardsInfiniteQuery()
  const { data: memoPages, isLoading: areMemosLoading } =
    useMemoListInfiniteQuery()
  const previewCourses = courseList?.items.slice(0, 3) ?? []
  const savedPlaces = savedPlaceList?.items.slice(0, 3) ?? []
  const savedStories =
    savedStoryPages?.pages.flatMap((page) => page.content).slice(0, 3) ?? []
  const memos =
    memoPages?.pages.flatMap((page) => page.content).slice(0, 3) ?? []
  const savedStoryCount =
    savedStoryPages?.pages[0]?.totalElements ??
    myPage?.savedStories.totalCount ??
    0
  const memoCount =
    memoPages?.pages[0]?.totalElements ?? myPage?.memos.totalCount ?? 0

  if (location.pathname !== '/my') {
    return <Outlet />
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title={t('common:nav.mypage')}
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
            {myPage?.profile.nickname || t('profile.name_fallback')}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-10">
          <SavedSection
            title={t('travel_note.my_title')}
            count={courseList?.totalCount ?? 0}
            emptyText={t('travel_note.section_empty')}
            onClick={() => navigate({ to: '/my/travel-notes' })}
          >
            {areCoursesLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner className="size-10 text-brand-primary" />
              </div>
            ) : previewCourses.length > 0 ? (
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain">
                {previewCourses.map((course) => (
                  <div
                    key={course.tourCourseId}
                    className="w-full shrink-0 snap-start"
                  >
                    <NoteCourseCard
                      imageUrl={course.thumbnailImg}
                      courseName={course.title}
                      dateRange={formatCourseDateRange(
                        course.createdAt,
                        course.updatedAt,
                      )}
                      distance={
                        course.totalDistanceMeter
                          ? formatCourseDistance(course.totalDistanceMeter)
                          : undefined
                      }
                      duration={
                        course.totalDurationSecond
                          ? formatCourseDuration(course.totalDurationSecond)
                          : undefined
                      }
                      itemCount={course.itemCount}
                      onClick={() =>
                        navigate({
                          to: '/my/travel-notes/$courseId',
                          params: {
                            courseId: String(course.tourCourseId),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : undefined}
          </SavedSection>

          <SavedSection
            title={t('place.title')}
            count={
              savedPlaceList?.totalCount ?? myPage?.savedSpots.totalCount ?? 0
            }
            emptyText={t('place.empty_title')}
            onClick={() => navigate({ to: '/my/saved-places' })}
          >
            {areSavedPlacesLoading ? (
              <PreviewGridSkeleton />
            ) : savedPlaces.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {savedPlaces.map((place) => (
                  <button
                    key={`${place.category}-${getPlaceId(place)}`}
                    type="button"
                    onClick={() =>
                      openPlaceDetail(getPlaceId(place), place.category)
                    }
                    className="min-w-0 overflow-hidden rounded-[8px] bg-bg-card text-left"
                  >
                    <div className="aspect-square w-full bg-gray-100">
                      {place.imageUrl || place.img ? (
                        <img
                          src={place.imageUrl ?? place.img}
                          alt={place.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-body2 font-medium text-text-heading">
                        {place.name}
                      </p>
                      <p className="mt-0.5 truncate text-caption text-text-subdued">
                        {placeCategoryLabel(place.category)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : undefined}
          </SavedSection>

          <SavedSection
            title={t('storycard.title')}
            count={savedStoryCount}
            emptyText={t('storycard.empty_description')}
            onClick={() => navigate({ to: '/my/saved-storycards' })}
          >
            {areSavedStoriesLoading ? (
              <PreviewGridSkeleton />
            ) : savedStories.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {savedStories.map((story) => (
                  <button
                    key={story.storyId}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: '/storycards/$spotId',
                        params: { spotId: String(story.spotId) },
                      })
                    }
                    className="min-w-0 overflow-hidden rounded-[8px] bg-bg-card text-left"
                  >
                    <div className="aspect-[3/4] w-full bg-gray-100">
                      {story.imageUrl ? (
                        <img
                          src={story.imageUrl}
                          alt={story.tourSpotName}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-body2 font-medium text-text-heading">
                        {story.tourSpotName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : undefined}
          </SavedSection>

          <SavedSection
            title={t('memo.title')}
            count={memoCount}
            emptyText={t('memo.empty_title')}
            onClick={() => navigate({ to: '/my/memos' })}
            className="pb-2"
          >
            {areMemosLoading ? (
              <PreviewListSkeleton />
            ) : memos.length > 0 ? (
              <div className="flex flex-col gap-2">
                {memos.map((memo) => (
                  <button
                    key={memo.memoId}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: '/note/$courseId/place/$placeId/edit-memo',
                        params: {
                          courseId: 'memo',
                          placeId: String(memo.spotId),
                        },
                        search: { from: 'mypage' },
                      })
                    }
                    className="rounded-[12px] bg-primary-50 p-3 text-left"
                  >
                    <p className="truncate text-body1 font-medium text-text-heading">
                      {memo.spotName}
                    </p>
                    <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-caption text-text-subdued">
                      {memo.content}
                    </p>
                  </button>
                ))}
              </div>
            ) : undefined}
          </SavedSection>
        </div>
      </main>

      <BottomNavBar />
    </div>
  )
}

function PreviewGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[3/4] animate-pulse rounded-[8px] bg-gray-200"
        />
      ))}
    </div>
  )
}

function PreviewListSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-[12px] bg-gray-200"
        />
      ))}
    </div>
  )
}

function SavedSection({
  title,
  count,
  emptyText,
  onClick,
  children,
  className,
}: {
  title: string
  count: number
  emptyText: string
  onClick: () => void
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
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
