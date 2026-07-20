import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import BottomNavBar from '@/components/layout/bottom-nav-bar'
import CourseDetailHeader from '@/components/note/course-detail-header'
import CourseDetailTabs from '@/components/note/course-detail-tabs'
import CourseDateSelector from '@/components/note/course-date-selector'
import CourseScheduleItem from '@/components/note/course-schedule-item'
import StoryCard from '@/components/note/story-card'

export const Route = createFileRoute('/(authentication)/note/$courseId')({
  component: RouteComponent,
})

const MOCK_COURSE_DETAIL = {
  courseName: '신라 야경 코스',
  dateRange: '26-06-09 ~ 26-06-09',
  tags: ['#여행지', '#경주', '#신라'],
  totalDays: 3,
}

const MOCK_SCHEDULES = [
  {
    id: 1,
    time: '10:30',
    placeName: '첨성대',
    category: '관광지',
    memo: '신라시대 천문대로 유명한 곳입니다. 사진 찍기 좋아요!',
    transportation: '승용차',
  },
  {
    id: 2,
    time: '12:00',
    placeName: '황남빵 본점',
    category: '음식점',
    transportation: '도보',
  },
  {
    id: 3,
    time: '14:00',
    placeName: '대릉원',
    category: '관광지',
    memo: '고분 투어 코스',
    transportation: '대중교통',
  },
  {
    id: 4,
    time: '16:30',
    placeName: '동궁과 월지',
    category: '관광지',
    memo: '야경이 정말 아름다운 곳입니다.',
    transportation: '승용차',
  },
]

const MOCK_STORIES = [
  {
    id: 1,
    placeName: '첨성대',
    subtitle: '별을 읽던 신라의 탑',
  },
  {
    id: 2,
    placeName: '대릉원',
    subtitle: '고분 속 숨겨진 이야기',
  },
  {
    id: 3,
    placeName: '동궁과 월지',
    subtitle: '달빛이 비치는 연못',
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'timeline' | 'story'>('timeline')
  const [selectedDay, setSelectedDay] = useState(1)

  const handleBack = () => {
    navigate({ to: '/note' })
  }

  const handleDelete = () => {
    // TODO: 삭제 모달
  }

  return (
    <div className="relative flex h-svh flex-col">
      <CourseDetailHeader
        courseName={MOCK_COURSE_DETAIL.courseName}
        dateRange={MOCK_COURSE_DETAIL.dateRange}
        tags={MOCK_COURSE_DETAIL.tags}
        onBack={handleBack}
        onDelete={handleDelete}
      />

      <main className="flex-1 overflow-y-auto bg-white pb-24">
        <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'timeline' && (
          <>
            <CourseDateSelector
              selectedDay={selectedDay}
              totalDays={MOCK_COURSE_DETAIL.totalDays}
              onDayChange={setSelectedDay}
            />
            <div className="relative flex flex-col">
              {MOCK_SCHEDULES.map((schedule, index) => (
                <CourseScheduleItem
                  key={schedule.id}
                  time={schedule.time}
                  placeName={schedule.placeName}
                  category={schedule.category}
                  memo={schedule.memo}
                  transportation={schedule.transportation}
                  imageUrl={schedule.imageUrl}
                  isFirst={index === 0}
                  isLast={index === MOCK_SCHEDULES.length - 1}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'story' && (
          <div className="flex flex-col gap-4 px-5">
            {MOCK_STORIES.map((story) => (
              <StoryCard
                key={story.id}
                placeName={story.placeName}
                subtitle={story.subtitle}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  )
}
