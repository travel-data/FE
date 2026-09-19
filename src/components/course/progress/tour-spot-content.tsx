import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import StampLogo from '@/assets/icons/stamp-logo.svg?react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useClearStampMission } from '@/hooks/mutations/place'
import { useTourSpotStoryCard } from '@/hooks/queries/story'
import type { StampMissionType, StampProgress } from '@/types/place'
import QrScanDialog from './qr-scan-dialog'
import StoryCardPreview from '@/components/story/story-card-preview'

const MISSION_LABEL_KEY = {
  VISIT: 'stamp.mission_visit',
  QR_SCAN: 'stamp.mission_qr',
  STORY_CARD: 'stamp.mission_story',
} as const satisfies Record<StampMissionType, string>

interface TourSpotContentProps {
  courseId: string
  spotId: number
  stampProgress: StampProgress | null
}

function TourSpotContent({
  courseId,
  spotId,
  stampProgress,
}: TourSpotContentProps) {
  const { t } = useTranslation('place')
  const navigate = useNavigate()
  const { mutate: clearMission, isPending } = useClearStampMission()
  const { data: storyCard } = useTourSpotStoryCard(spotId)
  const [qrOpen, setQrOpen] = useState(false)

  const clear = (missionType: StampMissionType) => {
    clearMission(
      { spotId, missionType },
      { onSuccess: () => toast.success(t('stamp.acquired')) },
    )
  }

  const handleMissionClick = (type: StampMissionType) => {
    if (isPending) return
    if (type === 'VISIT') clear('VISIT')
    else if (type === 'QR_SCAN') setQrOpen(true)
    else if (type === 'STORY_CARD') {
      navigate({
        to: '/storycards/$spotId',
        params: { spotId: String(spotId) },
        search: { from: 'course-progress', courseId },
      })
    }
  }

  return (
    <>
      {storyCard && (
        <div className="p-5 flex flex-col bg-gray-100">
          <div className="mb-2">
            <p className="text-body2 font-semibold">
              {t('detail.storycard_title')}
            </p>
            <span className="text-text-subdued text-label block">
              {t('detail.storycard_description')}
            </span>
          </div>
          <Link
            to="/storycards/$spotId"
            params={{ spotId: String(spotId) }}
            search={{ from: 'course-progress', courseId }}
          >
            <StoryCardPreview
              imageUrl={storyCard.imageUrl}
              title={storyCard.title}
              subTitle={storyCard.subTitle}
              label={t('detail.storycard_badge')}
              className="h-46"
            />
          </Link>
        </div>
      )}

      {stampProgress && (
        <div className="p-5 pb-1">
          <p className="text-body2 font-semibold">{t('detail.stamp_title')}</p>
          <span className="text-text-subdued text-label block mb-4">
            {t('detail.stamp_description')}
          </span>

          <ul className="flex items-center gap-3 flex-nowrap overflow-x-scroll">
            {stampProgress.missions.map((mission) => {
              const isStoryCard = mission.type === 'STORY_CARD'
              const disabled = mission.cleared || isStoryCard || isPending
              return (
                <li key={mission.type}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleMissionClick(mission.type)}
                    className={cn(
                      'p-4 flex text-center text-label flex-col gap-2.5 items-center justify-center min-w-26 rounded-lg whitespace-pre-line',
                      mission.cleared
                        ? 'bg-primary-50 text-brand-primary'
                        : 'bg-gray-100 text-text-default',
                      isStoryCard && !mission.cleared && 'opacity-40',
                    )}
                  >
                    <StampLogo
                      className={cn(
                        mission.cleared
                          ? 'fill-brand-primary'
                          : 'fill-gray-400',
                      )}
                    />
                    <span>{t(MISSION_LABEL_KEY[mission.type])}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <QrScanDialog
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        isSubmitting={isPending}
        onScanned={() =>
          clearMission(
            { spotId, missionType: 'QR_SCAN' },
            {
              // 완료(성공/실패) 후 모달 닫기. pending 동안은 모달에서 로딩 표시
              onSuccess: () => {
                setQrOpen(false)
                toast.success(t('stamp.acquired'))
              },
              onError: () => {
                setQrOpen(false)
                toast.error(t('stamp.clear_failed'))
              },
            },
          )
        }
      />
    </>
  )
}

export default TourSpotContent
