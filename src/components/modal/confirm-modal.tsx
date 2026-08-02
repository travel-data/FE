import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  cancelLabel?: string
  actionLabel: string
  onCancel?: () => void
  onAction: () => void
}

function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  actionLabel,
  onCancel,
  onAction,
}: ConfirmModalProps) {
  const { t } = useTranslation('common')

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-99.5 rounded-xl px-4 py-5"
      >
        <DialogHeader className="text-center flex-1 py-5 justify-center">
          <DialogTitle className="text-center text-title3 font-semibold text-text-heading">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-body2 text-text-subdued whitespace-pre-line">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex gap-3">
          <Button variant="soft" className="flex-1" onClick={handleCancel}>
            {cancelLabel || t('button.cancel')}
          </Button>
          <Button className="flex-1" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal
