import LeftArrowIcon from '@/assets/icons/left-arrow-icon.svg?react'
import EmptyBookmarkIcon from '@/assets/icons/empty-bookmark-icon.svg?react'
import FillBookmarkIcon from '@/assets/icons/fill-bookmark-icon.svg?react'
import { cn } from '@/lib/utils'
import { ChevronDown, Lightbulb } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Drawer as DrawerPrimitive } from 'vaul'

const SHEET_SNAP_POINTS = [0.3, 0.98] as const
const SHEET_PEEK = SHEET_SNAP_POINTS[0]
const SHEET_MAX = SHEET_SNAP_POINTS[SHEET_SNAP_POINTS.length - 1]

interface StoryCardMainSection {
  title: string
  sentences: string[]
  imageUrl?: string
}

interface StoryCardInfoBox {
  title: string
  content: string
}

interface StoryCardDetailProps {
  imageUrl?: string
  name: string
  subtitle: string
  summary?: string
  tags?: string[]
  introContent?: string
  mainSection?: StoryCardMainSection
  didYouKnow?: string
  tip?: StoryCardInfoBox
  saved: boolean
  onToggleSave: () => void
  isSavePending?: boolean
  onBack: () => void
  onReadProgress?: () => void
}

function StoryInfoBox({
  title,
  content,
  icon,
}: StoryCardInfoBox & { icon?: boolean }) {
  return (
    <div className="rounded-[12px] bg-gray-200 p-4">
      <div className="flex items-center gap-1">
        {icon ? <Lightbulb className="size-3 text-text-heading" /> : null}
        <p className="text-body2 font-bold text-text-heading">{title}</p>
      </div>
      <p className="mt-1 text-label text-text-default">{content}</p>
    </div>
  )
}

function StoryTitleSection({
  name,
  subtitle,
  summary,
  tags,
  introContent,
}: Pick<
  StoryCardDetailProps,
  'name' | 'subtitle' | 'summary' | 'tags' | 'introContent'
>) {
  const { t } = useTranslation('place')

  return (
    <section>
      <h1 className="text-title1 text-text-default">{name}</h1>
      <p className="text-body2 text-text-subdued">{subtitle}</p>
      {summary ? (
        <p className="mt-3 text-body2 text-text-default">{summary}</p>
      ) : null}

      {tags && tags.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[8px] bg-brand-primary px-3.5 py-1 text-label text-primary-50"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4">
        <StoryInfoBox
          title={t('storycard.insight')}
          content={introContent ?? t('storycard.insight_fallback')}
        />
      </div>
    </section>
  )
}

function StoryMainSection({
  title,
  sentences,
  imageUrl,
}: StoryCardMainSection) {
  return (
    <section className="mt-4">
      <h2 className="text-title3 text-text-default">{title}</h2>
      <div className="mt-2 flex flex-col gap-2">
        {sentences.map((sentence) => (
          <p key={sentence} className="text-body2 text-text-default">
            {sentence}
          </p>
        ))}
      </div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="mt-2 h-60 w-full rounded-lg object-cover"
        />
      ) : null}
    </section>
  )
}

function StoryDidYouKnowSection({
  content,
  tip,
}: {
  content?: string
  tip?: StoryCardInfoBox
}) {
  const { t } = useTranslation('place')

  return (
    <section className="mt-4">
      <h2 className="text-title3 text-text-default">
        {t('storycard.did_you_know')}
      </h2>
      <p className="mt-1 text-body2 text-text-default">
        {content ?? t('storycard.did_you_know_fallback')}
      </p>

      <div className="mt-4">
        <StoryInfoBox
          icon
          title={tip?.title ?? t('storycard.tip')}
          content={tip?.content ?? t('storycard.tip_fallback')}
        />
      </div>
    </section>
  )
}

function StoryCardDetail({
  imageUrl,
  name,
  subtitle,
  summary,
  tags = [],
  introContent,
  mainSection,
  didYouKnow,
  tip,
  saved,
  onToggleSave,
  isSavePending = false,
  onBack,
  onReadProgress,
}: StoryCardDetailProps) {
  const { t } = useTranslation('place')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeSnapPoint, setActiveSnapPoint] = useState<
    number | string | null
  >(SHEET_PEEK)
  const touchStartY = useRef<number | null>(null)
  const contentTouchStartY = useRef<number | null>(null)
  const hasCompletedReadingRef = useRef(false)
  const isFullyExpanded = activeSnapPoint === SHEET_MAX

  const openSheet = () => {
    setIsSheetOpen(true)
    setActiveSnapPoint(SHEET_PEEK)
  }

  const expandSheet = () => {
    setIsSheetOpen(true)
    setActiveSnapPoint(SHEET_MAX)
  }

  const handleTouchEnd = (clientY: number) => {
    if (touchStartY.current === null) return

    const swipeDistance = touchStartY.current - clientY
    if (swipeDistance > 24 && !isSheetOpen) {
      expandSheet()
    }

    touchStartY.current = null
  }

  return (
    <section
      className="relative h-dvh overflow-hidden bg-gray-900"
      onTouchStart={(event) => {
        if (isSheetOpen) return
        touchStartY.current = event.touches[0]?.clientY ?? null
      }}
      onTouchEnd={(event) => {
        if (isSheetOpen) return
        handleTouchEnd(event.changedTouches[0]?.clientY ?? 0)
      }}
      onWheel={(event) => {
        if (!isSheetOpen && event.deltaY > 12) {
          expandSheet()
        }
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-400" />
      )}

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/35 to-transparent" />

      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack}
        className="absolute left-4 top-[calc(env(safe-area-inset-top)+10px)] z-20 flex size-11 items-center justify-center"
      >
        <LeftArrowIcon className="size-5 [&_path]:fill-white" />
      </button>

      <button
        type="button"
        aria-label={saved ? '스토리카드 저장 취소' : '스토리카드 저장'}
        aria-pressed={saved}
        onClick={onToggleSave}
        disabled={isSavePending}
        className="absolute right-4 top-[calc(env(safe-area-inset-top)+10px)] z-10 flex size-11 items-center justify-center rounded-full bg-black/20 disabled:opacity-50"
      >
        {saved ? (
          <FillBookmarkIcon className="fill-brand-primary" />
        ) : (
          <EmptyBookmarkIcon className="[&_path]:fill-white" />
        )}
      </button>

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] transition-opacity',
          isSheetOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <div className="mb-5 text-left text-white">
          <p className="text-display2">{name}</p>
          <p className="mt-1 text-title3">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={openSheet}
          className="flex w-full flex-col items-center justify-center p-2.5"
        >
          <span className="text-body2 text-white">
            {t('storycard.scroll_hint')}
          </span>
          <ChevronDown className="mt-1 size-6 text-primary-50" />
        </button>
      </div>

      <DrawerPrimitive.Root
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        snapPoints={[...SHEET_SNAP_POINTS]}
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        shouldScaleBackground={false}
        modal={false}
        handleOnly
        snapToSequentialPoint
      >
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Content
            className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-[98dvh] max-w-107.5 flex-col overflow-hidden rounded-t-3xl bg-white outline-none"
            onPointerDownOutside={() => setIsSheetOpen(false)}
            onWheel={(event) => {
              if (!isFullyExpanded && event.deltaY > 0) {
                event.preventDefault()
                expandSheet()
              }
            }}
          >
            <DrawerPrimitive.Handle className="my-3 shrink-0 opacity-0" />

            <div
              className={cn(
                'min-h-0 flex-1 px-5 pb-[calc(env(safe-area-inset-bottom)+46px)] pt-1',
                isFullyExpanded
                  ? 'overflow-y-auto overscroll-contain'
                  : 'overflow-y-hidden',
              )}
              onTouchStart={(event) => {
                if (isFullyExpanded) return
                contentTouchStartY.current = event.touches[0]?.clientY ?? null
              }}
              onTouchEnd={(event) => {
                if (isFullyExpanded || contentTouchStartY.current === null) {
                  return
                }

                const swipeDistance =
                  contentTouchStartY.current -
                  (event.changedTouches[0]?.clientY ?? 0)

                if (swipeDistance > 24) expandSheet()
                contentTouchStartY.current = null
              }}
              onScroll={(event) => {
                if (!onReadProgress || hasCompletedReadingRef.current) return

                const { scrollTop, scrollHeight, clientHeight } =
                  event.currentTarget
                const maxScrollTop = scrollHeight - clientHeight

                if (maxScrollTop > 0 && scrollTop / maxScrollTop >= 0.8) {
                  hasCompletedReadingRef.current = true
                  onReadProgress()
                }
              }}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <StoryTitleSection
                name={name}
                subtitle={subtitle}
                summary={summary}
                tags={tags}
                introContent={introContent}
              />

              <StoryMainSection
                title={mainSection?.title ?? '하늘을 읽는 신라의 탑'}
                sentences={
                  mainSection?.sentences ?? [
                    '신라 사람들은 하늘의 움직임을 바라보며 계절과 시간을 헤아렸습니다.',
                    '첨성대는 그 오래된 관찰의 흔적을 오늘의 여행자에게 조용히 건네는 장소입니다.',
                    '돌을 따라 시선을 올리면, 천 년 전 밤하늘을 바라보던 마음이 조금은 가까워집니다.',
                  ]
                }
                imageUrl={mainSection?.imageUrl ?? imageUrl}
              />

              <StoryDidYouKnowSection content={didYouKnow} tip={tip} />
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </section>
  )
}

export default StoryCardDetail
