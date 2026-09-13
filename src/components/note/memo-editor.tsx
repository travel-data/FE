import {
  useDeleteTourSpotMemo,
  useSaveTourSpotMemo,
} from '@/hooks/mutations/memo'
import { useTourSpotMemoQuery } from '@/hooks/queries/memo'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface MemoEditorProps {
  spotId: number
  onBack: () => void
}

function MemoEditor({ spotId, onBack }: MemoEditorProps) {
  const initializedSpotIdRef = useRef<number | null>(null)
  const [content, setContent] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const isValidSpotId = Number.isSafeInteger(spotId) && spotId > 0
  const memoQuery = useTourSpotMemoQuery(spotId, { enabled: isValidSpotId })
  const saveMutation = useSaveTourSpotMemo()
  const deleteMutation = useDeleteTourSpotMemo()
  const isMutating = saveMutation.isPending || deleteMutation.isPending
  const persistedMemo = memoQuery.data?.memo

  useEffect(() => {
    if (!memoQuery.isSuccess || initializedSpotIdRef.current === spotId) return

    setContent(memoQuery.data.memo?.content ?? '')
    initializedSpotIdRef.current = spotId
  }, [memoQuery.data, memoQuery.isSuccess, spotId])

  const handleComplete = () => {
    if (!content.trim()) {
      setValidationMessage('메모 내용을 입력해 주세요.')
      return
    }

    setValidationMessage('')
    saveMutation.mutate(
      {
        spotId,
        body: { content: content.trim() },
      },
      { onSuccess: onBack },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(spotId, { onSuccess: onBack })
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
