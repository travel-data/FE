import { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

function TopBar({ title, leftSlot, rightSlot }: TopBarProps) {
  return (
    <header className="flex h-19 items-center justify-between px-5 py-4 relative">
      {leftSlot && <div className="flex-1 z-10">{leftSlot}</div>}

      {title && (
        <h1 className="flex items-center justify-center flex-1 text-body1 font-semibold text-text-heading absolute inset-0">
          {title}
        </h1>
      )}
      {rightSlot && (
        <div className="flex-1 flex justify-end z-10">{rightSlot}</div>
      )}
    </header>
  )
}

export default TopBar
