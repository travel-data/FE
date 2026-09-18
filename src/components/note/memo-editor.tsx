import {
  useDeletePlaceMemo,
  useSavePlaceMemo,
} from '@/hooks/mutations/memo'
import { usePlaceMemoQuery } from '@/hooks/queries/memo'
import type { PlaceCategory } from '@/types/place'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface MemoEditorProps {
  spotId: number
  category?: PlaceCategory
  onBack: () => void
}

function MemoEditor({ spotId, category = 'TOUR_SPOT', onBack }: MemoEditorProps) {
  const initializedPlaceRef = useRef<string | null>(null)
  const [content, setContent] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const isValidSpotId = Number.isSafeInteger(spotId) && spotId > 0
  const memoQuery = usePlaceMemoQuery(spotId, category, { enabled: isValidSpotId })
  const saveMutation = useSavePlaceMemo()
  const deleteMutation = useDeletePlaceMemo()
  const isMutating = saveMutation.isPending || deleteMutation.isPending
  const persistedMemo = memoQuery.data?.memo

  useEffect(() => {
    const placeKey = `${category}:${spotId}`
    if (!memoQuery.isSuccess || initializedPlaceRef.current === placeKey) return

    setContent(memoQuery.data.memo?.content ?? '')
    initializedPlaceRef.current = placeKey
  }, [memoQuery.data, memoQuery.isSuccess, spotId, category])

  const handleComplete = () => {
    if (!content.trim()) {
      setValidationMessage('메모 내용을 입력해 주세요.')
      return
    }

    setValidationMessage('')
    saveMutation.mutate(
      {
        placeId: spotId,
        category,
        body: { content: content.trim(), imageUrl: persistedMemo?.imageUrl ?? null },
      },
      { onSuccess: onBack },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate({ placeId: spotId, category }, { onSuccess: onBack })
  }

  if (!isValidSpotId) {
    return (
      <div className="flex min-h-svh flex-col bg-white">
        <MemoEditorHeader onBack={onBack} />
        <p className="m-auto text-body1 text-text-subdued">
          올바르지 않은 관광지입니다.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <MemoEditorHeader
        onBack={onBack}
        onComplete={handleComplete}
        onDelete={persistedMemo ? handleDelete : undefined}
        disabled={memoQuery.isPending || isMutating}
      />

      <main className="flex-1 overflow-y-auto px-5">
        <div className="flex flex-col gap-3 py-4">
          {memoQuery.isPending ? (
            <p className="py-10 text-center text-body1 text-text-subdued">
              메모를 불러오는 중입니다.
            </p>
          ) : memoQuery.isError ? (
            <p className="py-10 text-center text-body1 text-status-error">
              메모를 불러오지 못했습니다.
            </p>
          ) : (
            <textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                setValidationMessage('')
              }}
              placeholder="메모를 입력하세요"
              rows={Math.max(8, content.split('\n').length)}
              className="w-full resize-none border-none text-body2 text-gray-700 outline-none"
            />
          )}

          {validationMessage ? (
            <p className="text-caption text-status-error">
              {validationMessage}
            </p>
          ) : null}
          {saveMutation.isError || deleteMutation.isError ? (
            <p className="text-caption text-status-error">
              메모 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          ) : null}
        </div>
      </main>

    </div>
  )
}

function MemoEditorHeader({
  onBack,
  onComplete,
  onDelete,
  disabled = false,
}: {
  onBack: () => void
  onComplete?: () => void
  onDelete?: () => void
  disabled?: boolean
}) {
  return (
    <header className="flex items-center justify-between px-5 py-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="flex size-11 items-center justify-center rounded-full bg-white"
      >
        <ChevronLeft className="size-[18px]" />
      </button>

      <div className="flex items-center gap-4">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="text-body1 text-text-subdued disabled:opacity-40"
          >
            삭제
          </button>
        ) : null}
        {onComplete ? (
          <button
            type="button"
            onClick={onComplete}
            disabled={disabled}
            className="text-body1 text-text-subdued disabled:opacity-40"
          >
            완료
          </button>
        ) : null}
      </div>
    </header>
  )
}

export default MemoEditor
