import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CourseSharingButton from './course-sharing-button'
import { useTranslation } from 'react-i18next'

interface SharingActions {
  onViewLink: () => void
  onEditPassword: () => void
  onStopSharing: () => void
}

interface CourseActionBarProps {
  isInProgress: boolean
  isSharing?: boolean
  sharingActions?: SharingActions
  onShare: () => void
  onStart: () => void
}

function CourseActionBar({
  isInProgress,
  isSharing = false,
  sharingActions,
  onShare,
  onStart,
}: CourseActionBarProps) {
  const { t } = useTranslation('course')

  return (
    <div className="flex shrink-0 gap-3 py-4 px-5">
      {isSharing && sharingActions ? (
        <CourseSharingButton {...sharingActions} />
      ) : (
        <Button variant="soft" className="flex-1 gap-2" onClick={onShare}>
          <Share2 className="size-4" />
          {t('button.shared_course')}
        </Button>
      )}
      {!isInProgress && (
        <Button className="flex-1" onClick={onStart}>
          {t('button.course_start')}
        </Button>
      )}
    </div>
  )
}

export default CourseActionBar
