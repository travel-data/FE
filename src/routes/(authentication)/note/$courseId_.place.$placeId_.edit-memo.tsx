import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Image as ImageIcon, Minus } from 'lucide-react'

export const Route = createFileRoute(
  '/(authentication)/note/$courseId_/place/$placeId_/edit-memo',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { courseId, placeId } = Route.useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})

  const [blocks, setBlocks] = useState<MemoBlock[]>([
    { id: createBlockId(), type: 'text', value: '' },
  ])
  const [cursor, setCursor] = useState<TextCursor | null>(null)
  const [pendingFocus, setPendingFocus] = useState<TextCursor | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!pendingFocus) return

    const textarea = textareaRefs.current[pendingFocus.blockId]
    if (!textarea) return

    textarea.focus()
    textarea.setSelectionRange(pendingFocus.position, pendingFocus.position)
    setPendingFocus(null)
  }, [blocks, pendingFocus])

  const handleBack = () => {
    navigate({
      to: '/note/$courseId/place/$placeId',
      params: { courseId, placeId },
    })
  }

  const handleComplete = () => {
    setSelectedImageId(null)
    setIsSaved(true)
  }

  const handleDelete = () => {
    const textBlock: MemoTextBlock = {
      id: createBlockId(),
      type: 'text',
      value: '',
    }

    setBlocks([textBlock])
    setCursor(null)
    setPendingFocus({ blockId: textBlock.id, position: 0 })
    setSelectedImageId(null)
    setIsSaved(false)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSaved) return

    const files = e.target.files

    if (files && files[0]) {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          insertImageAtCursor(event.target.result as string)
        }
      }

      reader.readAsDataURL(files[0])
    }

    e.target.value = ''
  }

  const insertImageAtCursor = (src: string) => {
    if (isSaved) return

    const activeCursor = cursor
    let nextFocus: TextCursor | null = null

    setBlocks((currentBlocks) => {
      const firstTextIndex = currentBlocks.findIndex(
        (block) => block.type === 'text',
      )
      const activeIndex = activeCursor
        ? currentBlocks.findIndex((block) => block.id === activeCursor.blockId)
        : firstTextIndex
      const insertIndex = activeIndex >= 0 ? activeIndex : currentBlocks.length
      const activeBlock = currentBlocks[insertIndex]
      const imageBlock: MemoImageBlock = {
        id: createBlockId(),
        type: 'image',
        src,
      }

      if (!activeBlock || activeBlock.type !== 'text') {
        const trailingText: MemoTextBlock = {
          id: createBlockId(),
          type: 'text',
          value: '',
        }
        nextFocus = { blockId: trailingText.id, position: 0 }

        return [...currentBlocks, imageBlock, trailingText]
      }

      const position = Math.min(
        activeCursor?.position ?? activeBlock.value.length,
        activeBlock.value.length,
      )
      const beforeBlock: MemoTextBlock = {
        ...activeBlock,
        value: activeBlock.value.slice(0, position),
      }
      const afterBlock: MemoTextBlock = {
        id: createBlockId(),
        type: 'text',
        value: activeBlock.value.slice(position),
      }

      nextFocus = { blockId: afterBlock.id, position: 0 }

      return [
        ...currentBlocks.slice(0, insertIndex),
        beforeBlock,
        imageBlock,
        afterBlock,
        ...currentBlocks.slice(insertIndex + 1),
      ]
    })

    setSelectedImageId(null)

    if (nextFocus) {
      setPendingFocus(nextFocus)
      setCursor(nextFocus)
    }
  }

  const handleImageClick = (id: string) => {
    if (isSaved) return

    setSelectedImageId(selectedImageId === id ? null : id)
  }

  const handleRemoveImage = (id: string) => {
    if (isSaved) return

    setBlocks((currentBlocks) =>
      ensureTextBlock(currentBlocks.filter((block) => block.id !== id)),
    )
    setSelectedImageId(null)
  }

  const handleTextChange = (id: string, value: string) => {
    if (isSaved) return

    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === id && block.type === 'text' ? { ...block, value } : block,
      ),
    )
  }

  const handleTextCursor = (
    id: string,
    textarea: HTMLTextAreaElement | null,
  ) => {
    if (!textarea) return

    setCursor({ blockId: id, position: textarea.selectionStart })
    setSelectedImageId(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="flex items-center justify-between px-5 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex size-11 items-center justify-center rounded-full bg-white"
        >
          <ChevronLeft className="size-[18px]" />
        </button>

        {!isSaved ? (
          <button
            type="button"
            onClick={handleComplete}
            className="text-body1 text-text-subdued"
          >
            완료
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDelete}
            className="text-body1 text-text-subdued"
          >
            삭제
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-5">
        <div className="flex flex-col gap-3 py-4">
          {blocks.map((block) =>
            block.type === 'text' ? (
              <textarea
                key={block.id}
                ref={(element) => {
                  textareaRefs.current[block.id] = element
                }}
                value={block.value}
                onChange={(e) => handleTextChange(block.id, e.target.value)}
                onFocus={(e) => handleTextCursor(block.id, e.currentTarget)}
                onClick={(e) => handleTextCursor(block.id, e.currentTarget)}
                onKeyUp={(e) => handleTextCursor(block.id, e.currentTarget)}
                onSelect={(e) => handleTextCursor(block.id, e.currentTarget)}
                placeholder={
                  blocks.length === 1 ? '메모를 입력하세요' : undefined
                }
                readOnly={isSaved}
                rows={Math.max(1, block.value.split('\n').length)}
                className="w-full resize-none border-none text-body2 text-gray-700 outline-none"
              />
            ) : (
              <div key={block.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleImageClick(block.id)}
                  disabled={isSaved}
                  className={`relative w-full overflow-hidden rounded-[8px] ${
                    selectedImageId === block.id
                      ? 'ring-2 ring-primary-600'
                      : ''
                  }`}
                >
                  <img src={block.src} alt="메모 이미지" className="w-full" />
                </button>

                {!isSaved && selectedImageId === block.id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(block.id)}
                    className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full border border-primary-600 bg-white"
                  >
                    <Minus className="size-3 text-primary-600" />
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      </main>

      <div className="flex h-12 items-center border-t border-gray-200 px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          disabled={isSaved}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaved}
          className="flex size-11 items-center justify-center disabled:cursor-default disabled:opacity-40"
        >
          <ImageIcon className="size-6 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

type MemoTextBlock = {
  id: string
  type: 'text'
  value: string
}

type MemoImageBlock = {
  id: string
  type: 'image'
  src: string
}

type MemoBlock = MemoTextBlock | MemoImageBlock

type TextCursor = {
  blockId: string
  position: number
}

function createBlockId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function ensureTextBlock(blocks: MemoBlock[]): MemoBlock[] {
  if (blocks.some((block) => block.type === 'text')) {
    return blocks
  }

  const textBlock: MemoTextBlock = {
    id: createBlockId(),
    type: 'text',
    value: '',
  }

  return [textBlock]
}
