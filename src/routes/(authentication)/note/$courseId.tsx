import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(authentication)/note/$courseId')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/my/travel-notes/$courseId',
      params: { courseId: params.courseId },
      replace: true,
    })
  },
})
