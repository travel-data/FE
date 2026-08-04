import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/festival/')({
  component: RouteComponent,
  beforeLoad: async () => {
    throw redirect({ to: '/' })
  },
})

function RouteComponent() {
  return null
}
