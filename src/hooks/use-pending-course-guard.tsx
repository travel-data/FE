import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import ConfirmModal from '@/components/modal/confirm-modal'
import { usePendingCourse } from '@/hooks/queries/course'
import { useUpdateCourseStatus } from '@/hooks/mutations/course'

type CtaDest = '/course/recommend' | '/course/create'

export function usePendingCourseGuard({ replace = false } = {}) {
  const { t } = useTranslation('course')
  const navigate = useNavigate()
  const { data: pendingCourse } = usePendingCourse()
  const { mutate: updateStatus } = useUpdateCourseStatus()
  const [pendingDest, setPendingDest] = useState<CtaDest | null>(null)

  const handleCtaClick = (to: CtaDest) => {
    if (pendingCourse) {
      setPendingDest(to)
      return
    }
    navigate({ to, replace })
  }

  const pendingModal = (
    <ConfirmModal
      open={pendingDest !== null}
      onOpenChange={(open) => {
        if (!open) setPendingDest(null)
      }}
      title={t('pending_modal.title')}
      description={t('pending_modal.description')}
      cancelLabel={t('pending_modal.create_new_course')}
      actionLabel={t('pending_modal.go_button')}
      onCancel={() => {
        if (!pendingDest) return
        const dest = pendingDest
        // 시작하지 않은 코스는 완료 처리 후 새 코스 생성으로 이동
        if (pendingCourse) {
          updateStatus({
            courseId: String(pendingCourse.tourCourseId),
            status: 'COMPLETED',
          })
        }
        navigate({ to: dest, replace })
      }}
      onAction={() => {
        if (!pendingCourse) return
        navigate({
          to: '/course/$courseId',
          params: { courseId: String(pendingCourse.tourCourseId) },
          replace,
        })
      }}
    />
  )

  return { handleCtaClick, pendingModal }
}
