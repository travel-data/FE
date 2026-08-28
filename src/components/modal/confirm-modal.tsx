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
  description?: ReactNode
  cancelLabel?: string
  actionLabel: string
  actionDisabled?: boolean
  onCancel?: () => void
  onAction: () => void
  children?: ReactNode
}

function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  actionLabel,
  actionDisabled,
  onCancel,
  onAction,
  children,
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
        className="rounded-xl px-4 py-5 gap-0"
      >
        <DialogHeader className="text-center flex-1 pt-4 pb-2 justify-center gap-0">
          <DialogTitle className="text-center text-title3 font-semibold text-text-heading">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center text-body2 text-text-subdued whitespace-pre-line">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}

        <div className="mt-4 flex gap-4">
          <Button variant="soft" className="flex-1" onClick={handleCancel}>
            {cancelLabel || t('button.cancel')}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onAction()
              onOpenChange(false)
            }}
            disabled={actionDisabled}
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal
