import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  leftSlot?: ReactNode
  rightSlot?: ReactNode
  className?: string
}

function TopBar({ title, leftSlot, rightSlot, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'flex h-19 items-center justify-between px-5 py-4 relative',
        className,
      )}
    >
      {leftSlot && <div className="flex-1 z-10">{leftSlot}</div>}

      {title && (
        <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-body1 font-semibold text-text-heading">
          {title}
        </h1>
      )}

      <div className="z-10 flex flex-1 justify-end">{rightSlot}</div>
    </header>
  )
}

export default TopBar
