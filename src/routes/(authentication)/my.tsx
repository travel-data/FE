import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authentication)/my')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authentication)/my"!</div>
}
