import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Spinner } from '@/components/ui/spinner'
import StampLogo from '@/assets/icons/stamp-logo.svg?react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useClearStampMission } from '@/hooks/mutations/place'
import { useTourSpotStoryCard } from '@/hooks/queries/story'
import { distanceMeters, getCurrentPosition } from '@/lib/geo'
import type { StampMissionType, StampProgress } from '@/types/place'
import QrScanDialog from './qr-scan-dialog'
import StoryCardPreview from '@/components/story/story-card-preview'

const VISIT_RADIUS_M = 1000

const MISSION_LABEL_KEY = {
  VISIT: 'stamp.mission_visit',
  QR_SCAN: 'stamp.mission_qr',
  STORY_CARD: 'stamp.mission_story',
} as const satisfies Record<StampMissionType, string>

interface TourSpotContentProps {
  courseId: string
  spotId: number
  stampProgress: StampProgress | null
  location: { lat: number; lng: number }
}

function TourSpotContent({
  courseId,
  spotId,
  stampProgress,
  location,
}: TourSpotContentProps) {
  const { t } = useTranslation('place')
  const navigate = useNavigate()
  const { mutate: clearMission, isPending } = useClearStampMission()
  const { data: storyCard } = useTourSpotStoryCard(spotId)
  const [qrOpen, setQrOpen] = useState(false)
  // 위치 조회(최대 10s) 동안 VISIT 재클릭을 막는 가드 (isPending은 clear 시작 후에야 true)
  const [locating, setLocating] = useState(false)

  const clear = (missionType: StampMissionType) => {
    clearMission(
      { spotId, missionType },
      { onSuccess: () => toast.success(t('stamp.acquired')) },
    )
  }

  const handleVisit = async () => {
    if (locating) return
    setLocating(true)
    try {
      const me = await getCurrentPosition()
      if (distanceMeters(me, location) <= VISIT_RADIUS_M) {
        clear('VISIT')
      } else {
        toast.error(t('stamp.visit_too_far'))
      }
    } catch {
      toast.error(t('stamp.location_error'))
    } finally {
      setLocating(false)
    }
  }

  const handleMissionClick = (type: StampMissionType) => {
    if (isPending || locating) return
    if (type === 'VISIT') handleVisit()
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
              const isLocatingVisit = mission.type === 'VISIT' && locating
              const disabled =
                mission.cleared || isStoryCard || isPending || isLocatingVisit
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
                    {isLocatingVisit ? (
                      <Spinner className="text-brand-primary size-6" />
                    ) : (
                      <StampLogo
                        className={cn(
                          mission.cleared
                            ? 'fill-brand-primary'
                            : 'fill-gray-400',
                        )}
                      />
                    )}
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
