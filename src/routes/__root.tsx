import { PhoneShell } from '@/components/mobile'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <PhoneShell>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </PhoneShell>
  ),
})
