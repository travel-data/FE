import { cn } from '@/lib/utils'

interface StoryCardPreviewProps {
  imageUrl: string | null
  title: string
  subTitle: string
  label: string
  className?: string
}

// 스토리카드 미리보기 카드(이미지 + 하단 그라데이션에 라벨 칩 + 부제).
// 진행 화면(관광지 스토리)과 홈(오늘의 스토리)에서 공용으로 쓰인다.
function StoryCardPreview({
  imageUrl,
  title,
  subTitle,
  label,
  className,
}: StoryCardPreviewProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border-1',
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full bg-gray-300 object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gray-300" />
      )}
      <div className="absolute bottom-0 left-0 flex h-full w-full flex-col justify-end bg-linear-to-t from-black/40 from-5% to-transparent p-4">
        <span className="flex w-fit items-center justify-center rounded-full bg-white px-2 py-0.5 text-caption font-bold text-text-default">
          {label}
        </span>
        <p className="pt-1 text-body2 font-bold text-white line-clamp-1 text-left">
          {subTitle}
        </p>
      </div>
    </div>
  )
}

export default StoryCardPreview
