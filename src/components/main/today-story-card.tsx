import { useTranslation } from 'react-i18next'
import StoryCardPreview from '@/components/story/story-card-preview'
import { useFeaturedStoryCard } from '@/hooks/queries/story'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { useNavigate } from '@tanstack/react-router'

// 홈 "오늘의 경주 이야기" 카드. featured 스토리카드 1개를 표시한다.
function TodayStoryCard() {
  const { t } = useTranslation('home')
  const requireAuth = useRequireAuth()
  const { data: story, isPending } = useFeaturedStoryCard()
  const navigate = useNavigate()
  if (isPending)
    return (
      <div className="aspect-square flex-1 animate-pulse rounded-lg bg-gray-200" />
    )
  if (!story)
    return <div className="aspect-square flex-1 rounded-lg bg-gray-200" />

  return (
    <button
      type="button"
      className="flex-1"
      // 로그인 사용자는 스토리카드 상세로, 게스트는 로그인 유도
      onClick={() =>
        requireAuth(() =>
          navigate({
            to: '/storycards/$spotId',
            params: { spotId: String(story.spotId) },
          }),
        )
      }
    >
      <StoryCardPreview
        imageUrl={story.imageUrl}
        title={story.title}
        subTitle={story.subTitle}
        label={t('today_storycard_label')}
        className="h-full w-full"
      />
    </button>
  )
}

export default TodayStoryCard
