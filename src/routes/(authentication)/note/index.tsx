import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(authentication)/note/')({
  beforeLoad: () => {
    throw redirect({ to: '/my/travel-notes', replace: true })
  },
})
