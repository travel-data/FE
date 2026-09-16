import LeftArrowIcon from '@/assets/icons/left-arrow-icon.svg?react'
import { cn } from '@/lib/utils'
import { ChevronDown, Lightbulb } from 'lucide-react'
import { useRef, useState } from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

const SHEET_SNAP_POINTS = [
  '236px',
  '420px',
  '620px',
  'calc(100svh - calc(env(safe-area-inset-top) + 12px))',
] as const
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
  title: string
  subtitle: string
  tags?: string[]
  introContent?: string
  mainSection?: StoryCardMainSection
  didYouKnow?: string
  tip?: StoryCardInfoBox
  onBack: () => void
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
  title,
  subtitle,
  tags,
  introContent,
}: Pick<
  StoryCardDetailProps,
  'name' | 'title' | 'subtitle' | 'tags' | 'introContent'
>) {
  return (
    <section>
      <h1 className="text-title1 text-text-default">{name}</h1>
      <p className="text-title3 text-text-default">{title}</p>
      <p className="text-body2 text-text-subdued">{subtitle}</p>

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
          title="이 장소에서 무엇을 보게 되나요?"
          content={
            introContent ??
            '장소의 분위기와 역사, 여행자가 머물며 느낄 수 있는 장면을 스토리로 정리해 보여줍니다.'
          }
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
          className="mt-2 aspect-[4/3] w-full rounded-[24px] object-cover"
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
  return (
    <section className="mt-4">
      <h2 className="text-title3 text-text-default">알고 있었나요?</h2>
      <p className="mt-1 text-body2 text-text-default">
        {content ??
          '이야기 속 장소는 시대와 사람들의 생활 방식이 겹쳐진 공간입니다. 지금 보이는 풍경 너머에 쌓인 시간을 함께 떠올려 보면 여행의 장면이 더 선명해집니다.'}
      </p>

      <div className="mt-4">
        <StoryInfoBox
          icon
          title={tip?.title ?? '알아두면 좋아요!'}
          content={
            tip?.content ??
            '방문 전 운영 시간과 주변 동선을 함께 확인하면 더 편하게 둘러볼 수 있습니다.'
          }
        />
      </div>
    </section>
  )
}

function StoryCardDetail({
  imageUrl,
  name,
  title,
  subtitle,
  tags = [],
  introContent,
  mainSection,
  didYouKnow,
  tip,
  onBack,
}: StoryCardDetailProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeSnapPoint, setActiveSnapPoint] = useState<
    number | string | null
  >(SHEET_PEEK)
  const touchStartY = useRef<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 바텀시트가 최대 확장 상태인지 확인
  const isFullyExpanded = activeSnapPoint === SHEET_MAX

  const openSheet = () => {
    setIsSheetOpen(true)
    setActiveSnapPoint(SHEET_PEEK)
  }

  const expandSheetOneStep = () => {
    setIsSheetOpen(true)
    setActiveSnapPoint((currentSnapPoint) => {
      const currentIndex = SHEET_SNAP_POINTS.findIndex(
        (snapPoint) => snapPoint === currentSnapPoint,
      )
      const nextIndex =
        currentIndex < 0
          ? 0
          : Math.min(currentIndex + 1, SHEET_SNAP_POINTS.length - 1)

      return SHEET_SNAP_POINTS[nextIndex]
    })
  }

  const handleTouchEnd = (clientY: number) => {
    if (touchStartY.current === null) return

    const swipeDistance = touchStartY.current - clientY
    if (swipeDistance > 24) {
      openSheet()
    }

    touchStartY.current = null
  }

  // 🔥 개선: 바텀시트 내부 스크롤 처리
  const handleContentScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const isAtTop = element.scrollTop === 0

    // 최대 확장 상태가 아니면서 위에서 아래로 스크롤 시도
    if (!isFullyExpanded && isAtTop) {
      event.preventDefault()
      expandSheetOneStep()
    }
  }

  // 🔥 개선: 휠 이벤트 스무스 처리
  const handleWheel = (event: React.WheelEvent) => {
    const contentElement = contentRef.current
    if (!contentElement) return

    const isAtTop = contentElement.scrollTop === 0
    const scrollingDown = event.deltaY > 0

    // 바텀시트가 최대 확장이 아니고, 아래로 스크롤 시도
    if (!isFullyExpanded && scrollingDown) {
      event.preventDefault()
      if (isSheetOpen) {
        expandSheetOneStep()
      } else {
        openSheet()
      }
      return
    }

    // 최대 확장 상태에서 맨 위에 있고 위로 스크롤 시도
    if (isFullyExpanded && isAtTop && !scrollingDown) {
      // 기본 스크롤 허용 (바텀시트 축소는 드래그로만)
      return
    }
  }

  // 🔥 개선: 바텀시트 드래그 핸들러
  const handleDragStart = (event: React.TouchEvent) => {
    const contentElement = contentRef.current
    if (!contentElement) return

    const isAtTop = contentElement.scrollTop === 0

    // 최대 확장 상태에서 맨 위가 아니면 드래그 방지
    if (isFullyExpanded && !isAtTop) {
      event.stopPropagation()
    }
  }

  return (
    <section
      className="relative h-svh overflow-hidden bg-gray-900"
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY ?? null
      }}
      onTouchEnd={(event) => {
        handleTouchEnd(event.changedTouches[0]?.clientY ?? 0)
      }}
      onWheel={handleWheel}
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
        className="absolute left-5 top-[calc(env(safe-area-inset-top)+10px)] z-20 flex size-11 items-center justify-center"
      >
        <LeftArrowIcon className="size-5 [&_path]:fill-white" />
      </button>

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] transition-opacity duration-300',
          isSheetOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <div className="mb-5 text-left text-white">
          <p className="text-display2">{name}</p>
          <h1 className="mt-1 text-heading1">{title}</h1>
          <p className="mt-1 text-title3">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={openSheet}
          className="flex w-full flex-col items-center justify-center p-2.5"
        >
          <span className="text-body2 text-white">스크롤하여 더 보기</span>
          <ChevronDown className="mt-1 size-6 animate-bounce text-primary-50" />
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
      >
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Content
            className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-107.5 flex-col rounded-t-3xl bg-white outline-none"
            onTouchStart={handleDragStart}
          >
            {/* 🔥 개선: 드래그 핸들 추가 */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="h-1 w-12 rounded-full bg-gray-300" />
            </div>

            <div
              ref={contentRef}
              className={cn(
                'max-h-[calc(100svh-calc(env(safe-area-inset-top)+12px))] px-5 pb-5 pt-4 transition-all',
                // 🔥 개선: 최대 확장 전에는 스크롤 방지
                isFullyExpanded
                  ? 'overflow-y-auto overscroll-contain'
                  : 'overflow-y-hidden'
              )}
              onScroll={handleContentScroll}
              style={{
                // 🔥 개선: 스무스 스크롤
                scrollBehavior: isFullyExpanded ? 'smooth' : 'auto',
              }}
            >
              <StoryTitleSection
                name={name}
                title={title}
                subtitle={subtitle}
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
