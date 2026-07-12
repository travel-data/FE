import { ReactNode } from 'react'

interface PhoneShellProps {
  children: ReactNode
  className?: string
}

export function PhoneShell({ children, className = '' }: PhoneShellProps) {
  return (
    <main className="phone-shell">
      <div className={`phone-screen ${className}`}>{children}</div>
    </main>
  )
}

interface OisoLogoProps {
  compact?: boolean
}

export function OisoLogo({ compact = false }: OisoLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${compact ? 'h-11' : 'h-[60px]'}`}>
      <div className="h-11 w-11 rounded-xl bg-brand-primary" />
      {!compact && (
        <span className="text-title3 font-bold text-text-heading">OISO</span>
      )}
    </div>
  )
}
