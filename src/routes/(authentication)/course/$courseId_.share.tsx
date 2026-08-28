import { createFileRoute, useNavigate } from '@tanstack/react-router'
import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import TextInputForm from '@/components/form/text-input-form'
import { Trans, useTranslation } from 'react-i18next'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/share',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('course')
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const handleSubmit = (_password: string) => {
    // TODO: 공유 비밀번호 API 연동
    navigate({
      to: '/course/$courseId',
      params: { courseId },
      state: { shareSuccess: true },
    })
  }

  return (
    <section className="flex h-svh flex-col">
      <TopBar leftSlot={<BackButton />} />
      <TextInputForm
        title={
          <Trans
            i18nKey={'shared.add_shared_password_form_title'}
            ns="course"
          />
        }
        onSubmit={handleSubmit}
        submitLabel={t('shared.password_complete_button')}
        type="password"
        minLength={4}
      />
    </section>
  )
}
