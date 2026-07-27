import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'
import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import PasswordInputForm from '@/components/form/password-input-form'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/share-edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('course')
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const handleSubmit = (_password: string) => {
    // TODO: 비밀번호 수정 API 연동
    navigate({
      to: '/course/$courseId',
      params: { courseId },
      state: { shareEditSuccess: true },
    })
  }

  return (
    <section className="flex h-svh flex-col">
      <TopBar leftSlot={<BackButton />} />
      <PasswordInputForm
        title={<Trans i18nKey="shared.edit_shared_password_form_title" ns="course" />}
        subtitle={t('shared.edit_shared_password_form_description')}
        submitLabel={t('shared.edit_password_submit_button')}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
