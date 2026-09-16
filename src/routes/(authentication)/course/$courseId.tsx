import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import BackButton from '@/components/button/back-button'
import { Button } from '@/components/ui/button'
import TopBar from '@/components/layout/top-bar'
import CourseDetailView from '@/components/course/detail/course-detail-view'
import CourseActionBar from '@/components/course/detail/course-action-bar'
import ShareLinkDrawer from '@/components/course/detail/share-link-drawer'
import { Spinner } from '@/components/ui/spinner'
import { useGetCourseDetail } from '@/hooks/queries/course'
import { useShareLink } from '@/hooks/use-share-link'
import { useCourseDays } from '@/hooks/use-course-days'
import {
  useAdvanceCourse,
  useUpdateCourseStatus,
} from '@/hooks/mutations/course'

export const Route = createFileRoute('/(authentication)/course/$courseId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const { data: courseDetail, isPending } = useGetCourseDetail(courseId)

  const { mutateAsync: startCourse } = useAdvanceCourse()
  const { mutateAsync: updateStatus } = useUpdateCourseStatus()

  const days = useCourseDays(courseDetail)

  const { isSharing, sharingActions, onShare, shareLinkDrawerProps } =
    useShareLink({ courseDetail, courseId })

  if (isPending || !courseDetail)
    return (
      <section className="flex flex-col items-center justify-center h-full">
        <Spinner className="size-10 text-brand-primary " />
      </section>
    )

  return (
    <>
      <section className="relative flex h-svh flex-col">
        <div className="flex-1 overflow-y-auto">
          <TopBar
            leftSlot={<BackButton />}
            rightSlot={
              courseDetail.status === 'PENDING' && (
                <Button
                  onClick={() =>
                    navigate({
                      to: '/course/$courseId/edit',
                      params: { courseId },
                    })
                  }
                  variant="icon"
                  size="icon"
                >
                  <Pencil className="text-text-heading" />
                </Button>
              )
            }
          />

          <CourseDetailView courseDetail={courseDetail} />
        </div>

        <CourseActionBar
          isInProgress={courseDetail.status === 'IN_PROGRESS'}
          isSharing={isSharing}
          sharingActions={sharingActions}
          onShare={onShare}
          onStart={async () => {
            await Promise.all([
              startCourse({
                courseId,
                complete: [],
                start: days[0].places[0].id,
              }),
              updateStatus({ courseId, status: 'IN_PROGRESS' }),
            ])
            navigate({
              to: '/course/$courseId/progress',
              params: { courseId },
              replace: true,
            })
          }}
        />
      </section>

      <ShareLinkDrawer {...shareLinkDrawerProps} />
    </>
  )
}
