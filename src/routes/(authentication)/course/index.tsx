import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authentication)/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authentication)/course/"!</div>
}
