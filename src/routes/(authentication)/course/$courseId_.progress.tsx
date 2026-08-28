import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import PlaceBookmarkButton from '@/components/place/place-bookmark-button'
import PlaceTrafficLabel from '@/components/place/place-traffic-label'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import StampLogo from '@/assets/icons/stamp-logo.svg?react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import NextPlaceSheet from '@/components/course/progress/next-place-sheet'
export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/progress',
)({
  component: RouteComponent,
})

function CoursePlaceHeader() {
  const { t } = useTranslation('course')
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-primary-400 text-label mb-1">
            {t('label.course_in_progress', { count: 1 })}
          </p>
          <h3 className="flex items-center gap-1.5 text-title3">
            첨성대
            <PlaceTrafficLabel trafficLevel="crowded" />
          </h3>
        </div>
        <Button className="text-caption text-primary-50 bg-primary-500 px-2 py-1.5 h-7.25 rounded-sm">
          {t('button.course_stop')}
        </Button>
      </div>
      <div className="flex items-center gap-0.5 text-text-subdued text-label">
        <MarkerIcon className="size-3" />
        <span>
          경북 경주시 첨성로 169-5 (인왕동 839-1) · {''}
          <a
            className="text-brand-primary font-bold"
            target="_blank"
            href={`http://m.map.kakao.com/scheme/look?p=${1},${1}`}
          >
            {t('button.directions', { ns: 'course' })}
          </a>
        </span>
      </div>
    </div>
  )
}

function RouteComponent() {
  const [nextPlaceSheet, setNextPlaceSheet] = useState(false)
  const { t } = useTranslation('place')

  return (
    <section className="flex flex-col h-svh">
      <TopBar
        leftSlot={<BackButton />}
        rightSlot={
          <div className="flex items-center gap-4">
            <PlaceBookmarkButton isBookmarked={true} />
            <Button onClick={() => {}} variant="icon" size="icon">
              <Pencil className="text-text-heading" />
            </Button>
          </div>
        }
        className="absolute top-0 left-0 w-full"
      />

      <div className="w-full bg-gray-300 h-70" />

      <div className="bg-bg-main flex-1 rounded-t-3xl -mt-4 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-scroll">
          <div className="px-5 pt-5">
            <CoursePlaceHeader />

            {/* Place Desc */}
            <div className="py-3">
              <span className="text-body2 font-semibold mb-1 block">
                {t('detail.description_title')}
              </span>
              <p className="text-label text-text-subdued">
                경주 첨성대는 신라 선덕여왕(재위 632~647년) 때 세워진 아시아에서
                가장 오래된 석조 천문 관측 시설(국보 제31호)입니다. 별을
                관측하거나 절기를 측정하기 위해 세워진 것으로 추정되며,
                신라인들의 뛰어난 과학적, 천문학적 지식을 고스란히 담고
                있습니다.
              </p>
            </div>
          </div>

          {/* Story Card */}
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
              to={'.'}
              className="relative rounded-lg overflow-hidden border border-border-1"
            >
              <div className="bg-gray-300 w-full h-46" />
              <div className="p-4 flex flex-col justify-end bg-linear-to-t from-black/40 to-transparent from-5% absolute bottom-0 left-0 w-full h-full">
                <span className="bg-white rounded-full text-caption font-bold px-3 py-0.5 text-text-default w-fit flex items-center justify-center">
                  스토리 카드
                </span>
                <p className="text-body2 font-semibold text-white pt-1">
                  별을 읽던 신라의 탑
                </p>
              </div>
            </Link>
          </div>

          {/* Stamp Mission */}
          <div className="p-5 pb-1">
            <p className="text-body2 font-semibold">
              {t('detail.stamp_title')}
            </p>
            <span className="text-text-subdued text-label block mb-4">
              {t('detail.stamp_description')}
            </span>

            <ul className="flex items-center gap-3 flex-nowrap overflow-x-scroll">
              {Array.from({ length: 6 }).map((_, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'p-4 flex text-center text-label  flex-col gap-2.5 items-center justify-center min-w-26 rounded-lg',
                    idx === 0
                      ? 'bg-primary-50 text-brand-primary'
                      : 'bg-gray-100 text-text-default',
                  )}
                >
                  <StampLogo
                    className={cn(
                      idx === 0 ? 'fill-brand-primary' : 'fill-gray-400',
                    )}
                  />
                  <span>
                    장소 <br /> 방문하기
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 rounded-3xl">
          <Button asChild className="flex-1" variant={'soft'}>
            <Link
              to={'/course/$courseId'}
              params={{ courseId: 'mock-course-id' }}
            >
              코스 전체보기
            </Link>
          </Button>
          <Button className="flex-1" onClick={() => setNextPlaceSheet(true)}>
            다음 장소로 이동
          </Button>
        </div>
      </div>
      {nextPlaceSheet && (
        <NextPlaceSheet
          isOpen={nextPlaceSheet}
          onClose={() => setNextPlaceSheet(false)}
        />
      )}
    </section>
  )
}
