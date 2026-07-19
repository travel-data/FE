import BackButton from '@/components/button/back-button'
import CourseRecommendForm from '@/components/course/recommend/course-recommend-form'
import useCourseRecommendForm from '@/components/course/recommend/use-course-recommend-form'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'

export const Route = createFileRoute('/(authentication)/course/recommend')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('course')
  const { values, setValue, isValid } = useCourseRecommendForm()

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
        <CourseRecommendForm values={values} setValue={setValue} />
      </div>

      <Button
        type="submit"
        form="course-recommend-form"
        disabled={!isValid}
        className="size-md"
      >
        {t('form.submit_button')}
      </Button>
    </section>
  )
}
