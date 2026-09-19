import LogoSymbol from '@/assets/icons/symbol.svg?react'
import { cn } from '@/lib/utils'

// 이미지가 없을 때 표시하는 공용 플레이스홀더. bg-gray-100 위에 로고 심볼 중앙 정렬.
function ImageFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-100',
        className,
      )}
      aria-hidden="true"
    >
      <LogoSymbol className="size-1/4 opacity-40" role="img" />
    </div>
  )
}

export default ImageFallback
