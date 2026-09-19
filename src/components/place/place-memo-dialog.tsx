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

import { useSavePlaceMemo } from '@/hooks/mutations/memo'
import { usePlaceMemoQuery } from '@/hooks/queries/memo'
import type { PlaceCategory } from '@/types/place'

const MAX_LENGTH = 1000

interface PlaceMemoDialogProps {
  placeId: number
  category: PlaceCategory
  isOpen: boolean
  onClose: () => void
}

function PlaceMemoDialog({
  placeId,
  category,
  isOpen,
  onClose,
}: PlaceMemoDialogProps) {
  const { t } = useTranslation('place')
  const { data, isPending } = usePlaceMemoQuery(placeId, category, {
    enabled: isOpen,
  })
  const { mutate: save, isPending: isSaving } = useSavePlaceMemo()

  const [content, setContent] = useState('')
  const placeKey = `${category}:${placeId}`

  // 열릴 때 현재 장소의 기존 메모로 1회만 초기화한다.
  // 편집 중 재조회가 발생해도 작성 내용을 덮어쓰지 않는다.
  const seededPlaceRef = useRef<string | null>(null)
  useEffect(() => {
    if (!isOpen) {
      seededPlaceRef.current = null
      return
    }
    if (!isPending && seededPlaceRef.current !== placeKey) {
      setContent(data?.memo?.content ?? '')
      seededPlaceRef.current = placeKey
    }
  }, [isOpen, isPending, data, placeKey])

  const handleSave = () => {
    save(
      {
        placeId,
        category,
        body: {
          content: content.trim(),
          imageUrl: data?.memo?.imageUrl ?? null,
        },
      },
      { onSuccess: onClose },
    )
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
            placeholder={isPending ? t('memo.loading') : t('memo.placeholder')}
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

export default PlaceMemoDialog
