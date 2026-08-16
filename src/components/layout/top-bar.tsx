import { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

function TopBar({ title, leftSlot, rightSlot }: TopBarProps) {
  return (
    <header className="relative flex h-19 items-center px-5 py-4">
      <div className="z-10 flex flex-1 justify-start">{leftSlot}</div>

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
