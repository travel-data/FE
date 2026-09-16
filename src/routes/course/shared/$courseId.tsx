import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import TextInputForm from '@/components/form/text-input-form'
import CourseDetailView from '@/components/course/detail/course-detail-view'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { usePublicCourse } from '@/hooks/queries/shared-course'
import { useVerifySharedPassword } from '@/hooks/mutations/shared-course'
import { isSharedAccessError } from '@/api/shared-course'
import { getSharedToken, clearSharedToken } from '@/lib/shared-course-token'

export const Route = createFileRoute('/course/shared/$courseId')({
  component: RouteComponent,
})

// 비밀번호 입력 게이트. 검증 성공 시 발급 토큰을 상위로 올려 공개 상세를 조회한다.
function PasswordGate({
  courseId,
  onVerified,
  onRevoked,
}: {
  courseId: string
  onVerified: (token: string) => void
  onRevoked: () => void
}) {
  const { t } = useTranslation('course')
  const { mutate: verify, data, isPending } = useVerifySharedPassword(courseId)
  const wrongPassword = data?.verified === false

  const handleSubmit = (password: string) => {
    if (isPending) return
    verify(password, {
      onSuccess: (res) => {
        if (!res.verified) return
        // ponytail: 백엔드 임시 대응 — 공유 중단 코스는 verified=true인데 토큰이 null.
        // 토큰이 없으면 접근 불가로 처리한다.
        if (res.accessToken) onVerified(res.accessToken)
        else onRevoked()
      },
    })
  }

  useEffect(() => {
    if (wrongPassword) {
      toast.error(t('shared.password_mismatch'))
    }
  }, [wrongPassword])

  return (
    <section className="flex h-svh flex-col">
      <TopBar leftSlot={<BackButton />} />
      <TextInputForm
        title={
          <Trans i18nKey="shared.add_shared_password_form_title" ns="course" />
        }
        placeholder={t('shared.password_input_placeholder')}
        submitLabel={t('shared.password_complete_button')}
        type="password"
        minLength={1}
        maxLength={5}
        onSubmit={handleSubmit}
      />
    </section>
  )
}

// 공유 중단/토큰 만료 등 더 이상 접근할 수 없는 코스 안내 + 홈 이동
function AccessDeniedView() {
  const { t } = useTranslation('course')
  const navigate = useNavigate()

  return (
    <section className="flex h-svh flex-col">
      <TopBar leftSlot={<BackButton />} />
      <div className="m-auto flex flex-col items-center gap-6 px-5 text-center">
        <p className="text-body1 text-text-subdued">
          {t('shared.access_denied')}
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          {t('shared.go_home')}
        </Button>
      </div>
    </section>
  )
}

function RouteComponent() {
  const { courseId } = Route.useParams()
  // sessionStorage 토큰을 초기값으로, 이후 검증/만료를 반응형으로 다룬다.
  const [token, setToken] = useState(() => getSharedToken(courseId))
  // 검증은 통과했으나 접근이 거부된 상태(공유 중단)
  const [revoked, setRevoked] = useState(false)

  // 토큰 없이 먼저 조회 → featured(공개) 코스는 200, 공유 코스는 403
  const { data: course, isPending, error } = usePublicCourse(courseId, token)

  useEffect(() => {
    if (isSharedAccessError(error)) clearSharedToken(courseId)
  }, [error, courseId])

  // 공유 중단 확인 → 접근 불가
  if (revoked) return <AccessDeniedView />

  // 접근 거부(403): 토큰이 있으면 만료, 없으면 공유 코스라 비밀번호 입력이 필요
  if (isSharedAccessError(error)) {
    return token ? (
      <AccessDeniedView />
    ) : (
      <PasswordGate
        courseId={courseId}
        onVerified={setToken}
        onRevoked={() => setRevoked(true)}
      />
    )
  }

  if (isPending || !course) return <Spinner className="m-auto mt-20" />

  return (
    <section className="flex h-svh flex-col">
      <div className="flex-1 overflow-y-auto">
        <TopBar leftSlot={<BackButton />} />
        <CourseDetailView courseDetail={course} readOnly />
      </div>
    </section>
  )
}
