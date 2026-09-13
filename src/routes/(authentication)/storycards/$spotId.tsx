import LeftArrowIcon from '@/assets/icons/left-arrow-icon.svg?react'
import StoryCardDetail from '@/components/storycard/story-card-detail'
import { Spinner } from '@/components/ui/spinner'
import { useToggleStoryCardSave } from '@/hooks/mutations/story-card'
import { useClearStampMission } from '@/hooks/mutations/place'
import { useStoryCardDetailQuery } from '@/hooks/queries/story-card'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import axios from 'axios'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const Route = createFileRoute('/(authentication)/storycards/$spotId')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { from?: 'travel-notes' | 'course-progress'; courseId?: string } => ({
    from:
      search.from === 'travel-notes' || search.from === 'course-progress'
        ? search.from
        : undefined,
    courseId:
      typeof search.courseId === 'string' ? search.courseId : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { spotId: spotIdParam } = Route.useParams()
  const { from, courseId } = Route.useSearch()
  const spotId = Number(spotIdParam)
  const router = useRouter()
  const navigate = useNavigate()
  const { t } = useTranslation('place')
  const storyCardQuery = useStoryCardDetailQuery(spotId)
  const saveMutation = useToggleStoryCardSave()
  const clearMissionMutation = useClearStampMission()
  const hasRequestedStoryMissionRef = useRef(false)

  const handleBack = () => {
    if (from === 'travel-notes' && courseId) {
      navigate({
        to: '/my/travel-notes/$courseId',
        params: { courseId },
        search: { tab: 'story' },
        replace: true,
      })
      return
    }

    if (from === 'course-progress' && courseId) {
      navigate({
        to: '/course/$courseId/progress',
        params: { courseId },
        replace: true,
      })
      return
    }

    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: '/my', replace: true })
  }

  if (!Number.isSafeInteger(spotId) || spotId <= 0) {
    return (
      <StoryCardLoadState
        message="올바르지 않은 관광지입니다."
        onBack={handleBack}
      />
    )
  }

  if (storyCardQuery.isPending) {
    return <StoryCardLoadState loading onBack={handleBack} />
  }

  if (storyCardQuery.isError || !storyCardQuery.data) {
    const isNotFound =
      axios.isAxiosError(storyCardQuery.error) &&
      storyCardQuery.error.response?.status === 404

    return (
      <StoryCardLoadState
        message={
          isNotFound
            ? '이 관광지의 스토리카드가 아직 없습니다.'
            : '스토리카드를 불러오지 못했습니다.'
        }
        onBack={handleBack}
      />
    )
  }

  const storyCard = storyCardQuery.data
  const storySentences = storyCard.story
    .split(/\r?\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const handleReadProgress = () => {
    if (
      from !== 'course-progress' ||
      hasRequestedStoryMissionRef.current ||
      clearMissionMutation.isPending
    ) {
      return
    }

    hasRequestedStoryMissionRef.current = true
    clearMissionMutation.mutate(
      { spotId, missionType: 'STORY_CARD' },
      {
        onSuccess: () => toast.success(t('stamp.acquired')),
        onError: () => {
          hasRequestedStoryMissionRef.current = false
          toast.error(t('stamp.clear_failed'))
        },
      },
    )
  }

  return (
    <StoryCardDetail
      imageUrl={storyCard.imageUrl}
      name={storyCard.tourSpotName}
      subtitle={storyCard.subTitle}
      summary={storyCard.summary}
      tags={storyCard.hashtags}
      introContent={storyCard.intro}
      mainSection={{
        title: storyCard.storyTitle,
        sentences: storySentences,
        imageUrl: storyCard.imageUrl,
      }}
      didYouKnow={storyCard.didYouKnow}
      tip={
        storyCard.tip
          ? { title: '알아두면 좋아요!', content: storyCard.tip }
          : undefined
      }
      saved={storyCard.saved}
      onToggleSave={() =>
        saveMutation.mutate({
          storyId: storyCard.storyId,
          spotId: storyCard.spotId,
          saved: storyCard.saved,
        })
      }
      isSavePending={saveMutation.isPending}
      onBack={handleBack}
      onReadProgress={
        from === 'course-progress' ? handleReadProgress : undefined
      }
    />
  )
}

function StoryCardLoadState({
  loading = false,
  message,
  onBack,
}: {
  loading?: boolean
  message?: string
  onBack: () => void
}) {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-white px-5">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="absolute left-5 top-[calc(env(safe-area-inset-top)+10px)] flex size-11 items-center justify-center"
      >
        <LeftArrowIcon className="size-5" />
      </button>

      {loading ? (
        <Spinner className="size-6" />
      ) : (
        <p className="text-center text-body1 text-text-subdued">{message}</p>
      )}
    </div>
  )
}
