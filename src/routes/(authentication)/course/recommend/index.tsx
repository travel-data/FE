import BackButton from '@/components/button/back-button'
import CourseRecommendForm from '@/components/course/recommend/course-recommend-form'
import useCourseRecommendForm, {
  type CourseRecommendFormValues,
} from '@/components/course/recommend/use-course-recommend-form'
import { Button } from '@/components/ui/button'
import { useGenerateRecommendedCourse } from '@/hooks/mutations/course'
import type { UserPreferenceRequest } from '@/types/preference'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'

export const Route = createFileRoute('/(authentication)/course/recommend/')({
  component: RouteComponent,
})

const TRAVEL_TIME_MAP = {
  half_day: 'HALF_DAY',
  full_day: 'ONE_DAY',
  '1n2d': 'ONE_NIGHT_TWO_DAYS',
  '2n3d': 'TWO_NIGHTS_THREE_DAYS',
  '3n4d': 'THREE_NIGHTS_FOUR_DAYS',
} as const

const TRAVEL_COMPANION_MAP = {
  alone: 'ALONE',
  couple: 'PARTNER',
  friends: 'FRIENDS',
  family: 'FAMILY',
} as const

const PREFERRED_THEME_MAP = {
  history_culture: 'HISTORY_CULTURE',
  nature_scenery: 'NATURE_SCENERY',
  food_tour: 'FOOD',
} as const

const TRANSPORTATION_MODE_MAP = {
  walk_transit: 'WALK_PUBLIC_TRANSIT',
  bicycle: 'BICYCLE',
  car: 'CAR',
} as const

const COURSE_TITLE_MAP = {
  history_culture: '역사·문화 추천 코스',
  nature_scenery: '자연·경치 추천 코스',
  food_tour: '맛집 추천 코스',
} as const

function toPreferenceRequest(
  values: CourseRecommendFormValues,
): UserPreferenceRequest | null {
  if (!values.duration || !values.companionType || !values.transportation) {
    return null
  }

  return {
    hasTravelPlan: true,
    travelTime: TRAVEL_TIME_MAP[values.duration],
    travelCompanion: TRAVEL_COMPANION_MAP[values.companionType],
    preferredTravelTheme: values.preferredTheme
      ? PREFERRED_THEME_MAP[values.preferredTheme]
      : null,
    transportationMode: TRANSPORTATION_MODE_MAP[values.transportation],
    latitude: values.departure ? Number(values.departure.y) : null,
    longitude: values.departure ? Number(values.departure.x) : null,
  }
}

function RouteComponent() {
  const { t } = useTranslation('course')
  const { values, setValue, isValid } = useCourseRecommendForm()
  const navigate = useNavigate()
  const recommendationMutation = useGenerateRecommendedCourse()

  const handleSubmit = () => {
    const preference = toPreferenceRequest(values)
    if (!preference) return

    recommendationMutation.mutate(
      {
        preference,
        travelStartDate: values.travelStartDate,
        title: values.preferredTheme
          ? COURSE_TITLE_MAP[values.preferredTheme]
          : '나를 위한 추천 코스',
      },
      {
        onSuccess: (course) => {
          navigate({
            to: '/course/$courseId',
            params: { courseId: course.tourCourseId.toString() },
          })
        },
      },
    )
  }

  return (
    <section className="h-full flex flex-col justify-between px-5 py-4 gap-4">
      <div>
        <BackButton fallback="/" />
      </div>

      <div className="shrink-0 overflow-scroll">
        <h2 className="text-title2">
          <Trans i18nKey="form.title" ns="course" components={[<br />]} />
        </h2>
        <p className="text-body2 text-text-subdued mb-4">
          {t('form.description')}
        </p>
        <CourseRecommendForm
          values={values}
          setValue={setValue}
          onSubmit={handleSubmit}
        />
      </div>

      <Button
        type="submit"
        form="course-recommend-form"
        disabled={!isValid || recommendationMutation.isPending}
        className="size-md"
      >
        {recommendationMutation.isPending
          ? '추천 코스 생성 중...'
          : t('form.submit_button')}
      </Button>
      {recommendationMutation.isError ? (
        <p className="text-caption text-status-error" role="alert">
          추천 코스를 만들지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}
    </section>
  )
}
