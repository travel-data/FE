import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Pencil } from 'lucide-react'
import BackButton from '@/components/button/back-button'
import { Button } from '@/components/ui/button'
import TopBar from '@/components/layout/top-bar'
import KakaoRouteMap from '@/components/course/result/kakao-route-map'
import CourseSummary from '@/components/course/detail/course-summary'
import CourseDayTabs from '@/components/course/detail/course-day-tabs'
import { type TransportationType } from '@/components/course/detail/course-list-item'
import CourseActionBar from '@/components/course/detail/course-action-bar'
import ConfirmModal from '@/components/modal/confirm-modal'
import ShareLinkDrawer from '@/components/course/detail/share-link-drawer'
import { Trans, useTranslation } from 'react-i18next'

export const Route = createFileRoute('/(authentication)/course/$courseId')({
  component: RouteComponent,
})

const MOCK_COURSE = {
  name: '신라 야경 코스',
  tags: ['#야경', '#연인과함께', '#산책'],
  totalTime: '5시간 20분',
  description:
    '경주의 대표 야경 명소를 한 번에 둘러보는 코스예요.\n첨성대, 대릉원, 월성 해자, 동궁과 월지를 연결하는 동선으로, 도보로 이동하며 신라의 밤 풍경을 여유롭게 즐길 수 있어요.\n일몰 시간에 맞춰 출발하면 노을부터 야경까지 한 번에 즐길 수 있어요.',
}

interface CoursePlaceWithCoords {
  id: number
  name: string
  address: string
  description: string
  distanceToNext: string | null
  transportToNext: TransportationType | null
  lat: number
  lng: number
}

interface CourseDayWithCoords {
  day: number
  label: string
  places: CoursePlaceWithCoords[]
}

const MOCK_DAYS: CourseDayWithCoords[] = [
  {
    day: 1,
    label: '1',
    places: [
      {
        id: 1,
        name: '첨성대',
        address: '경북 경주시 첨성로 169-5 (인왕동 839-1)',
        description:
          '신라 선덕여왕 때 세워진 동양 최초의 천문대로, 경주를 대표하는 랜드마크',
        distanceToNext: '908m',
        transportToNext: 'walk',
        lat: 35.8358,
        lng: 129.2172,
      },
      {
        id: 2,
        name: '동궁과 월지',
        address: '경북 경주시 원화로 102 (인왕동)',
        description:
          '신라 선덕여왕 때 세워진 동양 최초의 천문대로, 경주를 대표하는 랜드마크',
        distanceToNext: '1.5km',
        transportToNext: 'bicycle',
        lat: 35.8349,
        lng: 129.226,
      },
      {
        id: 3,
        name: '월정교',
        address: '경북 경주시 교동 274-1',
        description:
          '신라 시대 월성과 남산을 잇던 교량으로, 야간 조명이 아름다운 명소',
        distanceToNext: null,
        transportToNext: null,
        lat: 35.8283,
        lng: 129.2049,
      },
    ],
  },
  {
    day: 2,
    label: '2',
    places: [
      {
        id: 4,
        name: '불국사',
        address: '경북 경주시 불국로 385',
        description:
          '신라 불교문화의 정수를 담은 세계문화유산, 석가탑과 다보탑이 유명',
        distanceToNext: '2.3km',
        transportToNext: 'car',
        lat: 35.7903,
        lng: 129.3316,
      },
      {
        id: 5,
        name: '석굴암',
        address: '경북 경주시 불국로 873-243',
        description: '토함산 정상에 위치한 통일신라시대 불교 조각의 걸작',
        distanceToNext: '5.1km',
        transportToNext: 'car',
        lat: 35.7945,
        lng: 129.3454,
      },
      {
        id: 6,
        name: '경주 국립박물관',
        address: '경북 경주시 일정로 186',
        description:
          '신라의 역사와 문화를 담은 유물 3만여 점을 소장한 국립박물관',
        distanceToNext: null,
        transportToNext: null,
        lat: 35.8348,
        lng: 129.2242,
      },
    ],
  },
]

type ShareLinkContext = 'created' | 'view' | 'edited'

function RouteComponent() {
  const { t } = useTranslation('course')
  const { courseId } = Route.useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [selectedDay, setSelectedDay] = useState(1)
  const [isSharing, setIsSharing] = useState(false)

  // 최초 공유 확인 모달
  const [shareConfirmOpen, setShareConfirmOpen] = useState(false)
  // 공유 링크 드로어 (created / view / edited 컨텍스트에 따라 타이틀 변경)
  const [shareLinkDrawer, setShareLinkDrawer] = useState<{
    open: boolean
    context: ShareLinkContext
  }>({ open: false, context: 'created' })
  // 공유 중단 확인 모달
  const [stopSharingConfirmOpen, setStopSharingConfirmOpen] = useState(false)

  const shareLinkTitles: Record<
    ShareLinkContext,
    { title: string; description: string }
  > = {
    created: {
      title: t('shared.alert_complete_shared_title'),
      description: t('shared.alert_complete_shared_description'),
    },
    view: {
      title: t('shared.view_link_title'),
      description: t('shared.alert_complete_shared_description'),
    },
    edited: {
      title: t('shared.alert_complete_edit_password'),
      description: t('shared.alert_complete_shared_description'),
    },
  }

  const openShareLinkDrawer = (context: ShareLinkContext) => {
    setShareLinkDrawer({ open: true, context })
  }

  // navigate state 감지: 최초 공유 완료
  useEffect(() => {
    if (location.state?.shareSuccess) {
      setIsSharing(true)
      openShareLinkDrawer('created')
      history.replaceState({ ...history.state, shareSuccess: undefined }, '')
    }
  }, [location.state?.shareSuccess])

  // navigate state 감지: 비밀번호 수정 완료
  useEffect(() => {
    if (location.state?.shareEditSuccess) {
      openShareLinkDrawer('edited')
      history.replaceState(
        { ...history.state, shareEditSuccess: undefined },
        '',
      )
    }
  }, [location.state?.shareEditSuccess])

  const currentDayData =
    MOCK_DAYS.find((d) => d.day === selectedDay) ?? MOCK_DAYS[0]

  const mapPlaces = useMemo(
    () => currentDayData.places.map(({ id, lat, lng }) => ({ id, lat, lng })),
    [currentDayData],
  )

  const sharingActions = {
    onViewLink: () => openShareLinkDrawer('view'),
    onEditPassword: () =>
      navigate({ to: '/course/$courseId/share-edit', params: { courseId } }),
    onStopSharing: () => setStopSharingConfirmOpen(true),
  }

  return (
    <>
      <section className="relative flex h-svh flex-col">
        <div className="flex-1 overflow-y-auto">
          <TopBar
            leftSlot={<BackButton />}
            rightSlot={
              <Button
                onClick={() =>
                  navigate({
                    to: '/course/$courseId/edit',
                    params: { courseId },
                  })
                }
                variant="icon"
                size="icon"
              >
                <Pencil className="text-text-heading" />
              </Button>
            }
          />

          <CourseSummary
            name={MOCK_COURSE.name}
            tags={MOCK_COURSE.tags}
            totalTime={MOCK_COURSE.totalTime}
            description={MOCK_COURSE.description}
            courseTypeLabel={t('recommend.course_type_label')}
          />

          <div className="mx-5 mt-5 h-48 overflow-hidden rounded-xl">
            <KakaoRouteMap key={selectedDay} places={mapPlaces} />
          </div>

          <div className="mt-4 px-5">
            <CourseDayTabs
              days={MOCK_DAYS}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
            />
          </div>
        </div>

        <CourseActionBar
          isSharing={isSharing}
          sharingActions={sharingActions}
          onShare={() => setShareConfirmOpen(true)}
          onStart={() => navigate({ to: '/note' })}
        />
      </section>

      {/* 최초 공유 확인 모달 */}
      <ConfirmModal
        open={shareConfirmOpen}
        onOpenChange={setShareConfirmOpen}
        title={t('confirm.shared_course_title')}
        description={
          <Trans i18nKey={'confirm.shared_course_description'} ns={'course'} />
        }
        actionLabel={t('button.confirm_shared')}
        onAction={() => {
          setShareConfirmOpen(false)
          navigate({ to: '/course/$courseId/share', params: { courseId } })
        }}
      />

      {/* 공유 링크 드로어 */}
      <ShareLinkDrawer
        open={shareLinkDrawer.open}
        onOpenChange={(open) =>
          setShareLinkDrawer((prev) => ({ ...prev, open }))
        }
        sheetTitle={shareLinkTitles[shareLinkDrawer.context].title}
        sheetDescription={shareLinkTitles[shareLinkDrawer.context].description}
      />

      {/* 공유 중단 확인 모달 */}
      <ConfirmModal
        open={stopSharingConfirmOpen}
        onOpenChange={setStopSharingConfirmOpen}
        title={t('confirm.stop_sharing_title')}
        description={
          <Trans i18nKey="confirm.stop_sharing_description" ns="course" />
        }
        actionLabel={t('button.confirm_stop_sharing')}
        onAction={() => {
          // TODO: 공유 중단 API 연동 + query invalidate
          setIsSharing(false)
          setStopSharingConfirmOpen(false)
        }}
      />
    </>
  )
}
