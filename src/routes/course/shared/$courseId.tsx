import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/course/shared/$courseId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authentication)/course/shared/"!</div>
}
