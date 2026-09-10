import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { useTourSpotMemo } from '@/hooks/queries/memo'
import { useSaveTourSpotMemo } from '@/hooks/mutations/memo'

const MAX_LENGTH = 1000

interface TourSpotMemoDialogProps {
  spotId: number
  isOpen: boolean
  onClose: () => void
}

function TourSpotMemoDialog({
  spotId,
  isOpen,
  onClose,
}: TourSpotMemoDialogProps) {
  const { t } = useTranslation('place')
  const { data, isPending } = useTourSpotMemo(spotId, { enabled: isOpen })
  const { mutate: save, isPending: isSaving } = useSaveTourSpotMemo()

  const [content, setContent] = useState('')

  // 열릴 때 조회된 기존 메모로 1회만 초기화.
  // (편집 도중 백그라운드 refetch가 작성 내용을 덮어쓰지 않도록 ref로 가드)
  const seededRef = useRef(false)
  useEffect(() => {
    if (!isOpen) {
      seededRef.current = false
      return
    }
    if (!seededRef.current && !isPending) {
      setContent(data?.memo?.content ?? '')
      seededRef.current = true
    }
  }, [isOpen, isPending, data])

  const handleSave = () => {
    save({ spotId, content: content.trim() }, { onSuccess: onClose })
  }

  const busy = isSaving

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-4" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-title3">{t('memo.title')}</DialogTitle>
        </DialogHeader>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
            placeholder={
              isPending ? t('memo.loading') : t('memo.placeholder')
            }
            disabled={isPending || busy}
            rows={6}
            className="w-full resize-none rounded-sm border border-gray-400 p-4 text-body2 text-text-default outline-none focus:border-brand-primary"
          />
          <p className="text-caption text-text-subdued text-right">
            {content.length}/{MAX_LENGTH}
          </p>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button
            variant="soft"
            className="flex-1"
            onClick={onClose}
            disabled={busy}
          >
            {t('button.close', { ns: 'common' })}
          </Button>
          <Button
            variant="solid"
            className="flex-1"
            onClick={handleSave}
            disabled={!content.trim() || busy}
          >
            {t('button.save', { ns: 'common' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TourSpotMemoDialog
