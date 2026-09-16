import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'
import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import TextInputForm from '@/components/form/text-input-form'
import { useGetCourseDetail } from '@/hooks/queries/course'
import { useUpdateCourseSharing } from '@/hooks/mutations/course'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/share-edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('course')
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const { data: courseDetail } = useGetCourseDetail(courseId)
  const { mutate: updateSharing, isPending } = useUpdateCourseSharing()

  const handleSubmit = (password: string) => {
    if (!courseDetail || isPending) return
    updateSharing(
      { detail: courseDetail, shareYn: true, sharedPassword: password },
      {
        onSuccess: () =>
          navigate({
            to: '/course/$courseId',
            params: { courseId },
            state: { shareEditSuccess: true },
            replace: true,
          }),
      },
    )
  }

  return (
    <section className="flex h-svh flex-col">
      <TopBar leftSlot={<BackButton />} />
      <TextInputForm
        title={<Trans i18nKey="shared.edit_shared_password_form_title" ns="course" />}
        subtitle={t('shared.edit_shared_password_form_description')}
        placeholder={t('shared.password_input_placeholder')}
        submitLabel={t('shared.edit_password_submit_button')}
        type="password"
        minLength={1}
        maxLength={5}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
