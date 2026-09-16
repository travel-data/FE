import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CourseSummary from './course-summary'
import CourseDayTabs from './course-day-tabs'
import KakaoRouteMap from '@/components/course/result/kakao-route-map'
import { useCourseDays } from '@/hooks/use-course-days'
import type { CourseDetail } from '@/types/course'

// 코스 상세의 표시부(요약 + 경로 지도 + 일차별 장소 목록).
// 내 코스 상세화면과 공유 뷰어가 공유한다. 액션(수정/시작/공유 등)은 포함하지 않는다.
// readOnly=true면 장소 상세 시트를 조회 전용으로 연다(공유 뷰어).
function CourseDetailView({
  courseDetail,
  readOnly = false,
}: {
  courseDetail: CourseDetail
  readOnly?: boolean
}) {
  const { t } = useTranslation('course')
  const [selectedDay, setSelectedDay] = useState(1)

  const days = useCourseDays(courseDetail)
  const currentDayData = days.find((d) => d.day === selectedDay) ?? days[0]

  const mapPlaces = useMemo(
    () =>
      currentDayData?.places.map(({ id }) => {
        const item = courseDetail.items.find((i) => i.itemId === id)!
        return { id, lat: item.latitude, lng: item.longitude }
      }) ?? [],
    [currentDayData, courseDetail],
  )

  return (
    <>
      <CourseSummary
        name={courseDetail.title}
        description=""
        courseTypeLabel={t('label.course')}
      />

      <div className="mx-5 mt-4 h-48 overflow-hidden rounded-xl">
        <KakaoRouteMap key={selectedDay} places={mapPlaces} />
      </div>

      <div className="mt-4 px-5">
        <CourseDayTabs
          days={days}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          readOnly={readOnly}
        />
      </div>
    </>
  )
}

export default CourseDetailView
