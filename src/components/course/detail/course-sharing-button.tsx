import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import ShareOptionDrawer from './share-option-drawer'
import { useTranslation } from 'react-i18next'

interface CourseSharingButtonProps {
  onViewLink: () => void
  onEditPassword: () => void
  onStopSharing: () => void
}

function CourseSharingButton({
  onViewLink,
  onEditPassword,
  onStopSharing,
}: CourseSharingButtonProps) {
  const { t } = useTranslation('course')

  const [optionOpen, setOptionOpen] = useState(false)

  const closeAndRun = (action: () => void) => () => {
    setOptionOpen(false)
    action()
  }

  return (
    <>
      <Button
        variant="soft"
        className="flex-1 gap-2"
        onClick={() => setOptionOpen(true)}
      >
        <Share2 className="size-4" />
        {t('button.course_sharing')}
      </Button>

      <ShareOptionDrawer
        isOpen={optionOpen}
        onClose={() => setOptionOpen(false)}
        onViewLink={closeAndRun(onViewLink)}
        onEditPassword={closeAndRun(onEditPassword)}
        onStopSharing={closeAndRun(onStopSharing)}
      />
    </>
  )
}

export default CourseSharingButton
