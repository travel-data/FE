import { useRef } from 'react'
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

interface QrScanDialogProps {
  isOpen: boolean
  onClose: () => void
  onScanned: () => void // QR 감지 성공 시 호출 (스탬프 완료 요청)
  isSubmitting: boolean // 완료 요청 진행 중 여부
}

function QrScanDialog({
  isOpen,
  onClose,
  onScanned,
  isSubmitting,
}: QrScanDialogProps) {
  const { t } = useTranslation('place')
  // onScan이 연속 발화하는 것을 막아 완료 요청 1회만 보냄
  const handledRef = useRef(false)

  const handleScan = (codes: IDetectedBarcode[]) => {
    if (handledRef.current || codes.length === 0) return
    handledRef.current = true
    onScanned()
  }

  const handleError = (error: unknown) => {
    // 카메라 권한 거부 → 모달 닫고 권한 안내 토스트
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      onClose()
      toast.error(t('qr.permission_denied'))
      return
    }
    onClose()
    toast.error(t('qr.camera_error'))
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return
        if (isSubmitting) return // 요청 중엔 닫기 방지
        handledRef.current = false
        onClose()
      }}
    >
      <DialogContent className="gap-4" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-title3">{t('qr.title')}</DialogTitle>
        </DialogHeader>

        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
          {isSubmitting ? (
            <div className="flex size-full flex-col items-center justify-center gap-3">
              <Spinner className="text-brand-primary size-8" />
              <p className="text-label text-text-subdued">{t('qr.checking')}</p>
            </div>
          ) : (
            <Scanner
              onScan={handleScan}
              onError={handleError}
              formats={['qr_code']}
              constraints={{ facingMode: 'environment' }}
            />
          )}
        </div>
        <p className="text-label text-text-subdued text-center">
          {t('qr.description')}
        </p>

        <Button
          variant="soft"
          className="w-full"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {t('button.close', { ns: 'common' })}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default QrScanDialog
