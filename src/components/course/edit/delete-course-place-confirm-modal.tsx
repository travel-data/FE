import ConfirmModal from '@/components/modal/confirm-modal'
import { useTranslation } from 'react-i18next'

interface DeleteCoursePlaceConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function DeleteCoursePlaceConfirmModal({
  open,
  onOpenChange,
  onConfirm,
}: DeleteCoursePlaceConfirmModalProps) {
  const { t } = useTranslation('course')

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('edit.confirm_delete_place_title')}
      description={t('edit.confirm_delete_place_description')}
      cancelLabel={t('button.cancel', { ns: 'common' })}
      actionLabel={t('edit.delete_place_button')}
      onAction={() => {
        onConfirm()
        onOpenChange(false)
      }}
    />
  )
}

export default DeleteCoursePlaceConfirmModal
