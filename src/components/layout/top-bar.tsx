import { ReactNode } from 'react'

interface TopBarProps {
  title: string
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

function TopBar({ title, leftSlot, rightSlot }: TopBarProps) {
  return (
    <header className="flex h-19 items-center justify-between px-5 py-4">
      <div className="flex-1">{leftSlot}</div>
      <h1 className="text-body1 font-semibold text-text-heading">{title}</h1>
      <div className="flex-1 flex justify-end">{rightSlot}</div>
    </header>
  )
}

export default TopBar
