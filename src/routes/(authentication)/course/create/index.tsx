import BackButton from '@/components/button/back-button'
import TextInputForm from '@/components/form/text-input-form'
import TopBar from '@/components/layout/top-bar'
import {
  courseFormStore,
  useCourseFormActions,
} from '@/stores/course-form-store'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/(authentication)/course/create/')({
  beforeLoad: () => courseFormStore.getState().actions.reset(),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { setTitle } = useCourseFormActions()
  const { t } = useTranslation('course')

  const handleSubmit = (title: string) => {
    setTitle(title)
    navigate({ to: '/course/create/places' })
  }

  return (
    <section className="flex flex-col h-svh justify-between">
      <TopBar leftSlot={<BackButton />} />

      <TextInputForm
        title={t('create.course_name_form_title')}
        subtitle={t('create.course_name_form_description')}
        minLength={4}
        placeholder={t('create.course_name_form_placeholder')}
        submitLabel={t('create.course_name_form_next')}
        onSubmit={(v) => handleSubmit(v)}
      />
    </section>
  )
}
