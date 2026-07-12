import { PhoneShell } from '@/components/mobile'
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <PhoneShell>
      <Outlet />
    </PhoneShell>
  ),
})
