export function PhoneShell({ children, className = '' }) {
  return (
    <main className="phone-shell">
      <section className={`phone-screen ${className}`}>{children}</section>
    </main>
  )
}

export function OisoLogo({ compact = false }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? 'h-11' : 'h-[60px]'}`}>
      <div className="h-11 w-11 rounded-xl bg-brand-primary" />
      {!compact && (
        <span className="text-title3 font-bold text-text-heading">OISO</span>
      )}
    </div>
  )
}
