import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/modal/confirm-modal'
import { useUpdateCourseStatus } from '@/hooks/mutations/course'

interface CourseStopButtonProps {
  courseId: string
}

function CourseStopButton({ courseId }: CourseStopButtonProps) {
  const { t } = useTranslation('course')
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useUpdateCourseStatus()

  const handleStop = () => {
    mutate(
      { courseId, status: 'COMPLETED' },
      { onSuccess: () => navigate({ to: '/', replace: true }) },
    )
  }

  return (
    <>
      <Button
        className="text-caption text-primary-50 bg-primary-500 px-2 py-1.5 h-7.25 rounded-sm"
        onClick={() => setOpen(true)}
      >
        {t('button.course_stop')}
      </Button>

      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={t('stop_modal.title')}
        description={
          <Trans
            ns="course"
            i18nKey={'stop_modal.description'}
            components={{ br: <br /> }}
          />
        }
        actionLabel={t('stop_modal.confirm')}
        actionDisabled={isPending}
        onAction={handleStop}
      />
    </>
  )
}

export default CourseStopButton
