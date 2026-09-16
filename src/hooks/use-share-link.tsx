import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import { useTranslation, Trans } from 'react-i18next'
import { useUpdateCourseSharing } from '@/hooks/mutations/course'
import type { CourseDetail } from '@/types/course'

type ShareLinkContext = 'created' | 'view' | 'edited'

export function useShareLink({
  courseDetail,
  courseId,
}: {
  courseDetail: CourseDetail | undefined
  courseId: string
}) {
  const { t } = useTranslation('course')
  const location = useLocation()
  const navigate = useNavigate()
  const openConfirm = useConfirmModalStore((s) => s.open)
  const { mutate: updateSharing } = useUpdateCourseSharing()

  // 공유 여부는 코스 상세에서 파생 → 설정/중단 후 재조회로 자동 반영
  const isSharing = courseDetail?.shareYn ?? false

  const [drawer, setDrawer] = useState<{
    open: boolean
    context: ShareLinkContext
  }>({ open: false, context: 'created' })

  const openDrawer = (context: ShareLinkContext) =>
    setDrawer({ open: true, context })

  useEffect(() => {
    if (location.state?.shareSuccess) {
      openDrawer('created')
      history.replaceState({ ...history.state, shareSuccess: undefined }, '')
    }
  }, [location.state?.shareSuccess])

  useEffect(() => {
    if (location.state?.shareEditSuccess) {
      openDrawer('edited')
      history.replaceState({ ...history.state, shareEditSuccess: undefined }, '')
    }
  }, [location.state?.shareEditSuccess])

  const titles: Record<
    ShareLinkContext,
    { title: string; description: string }
  > = {
    created: {
      title: t('shared.alert_complete_shared_title'),
      description: t('shared.alert_complete_shared_description'),
    },
    view: {
      title: t('shared.view_link_title'),
      description: t('shared.alert_complete_shared_description'),
    },
    edited: {
      title: t('shared.alert_complete_edit_password'),
      description: t('shared.alert_complete_shared_description'),
    },
  }

  const sharingActions = {
    onViewLink: () => openDrawer('view'),
    onEditPassword: () =>
      navigate({ to: '/course/$courseId/share-edit', params: { courseId } }),
    onStopSharing: () =>
      openConfirm({
        title: t('confirm.stop_sharing_title'),
        description: (
          <Trans i18nKey="confirm.stop_sharing_description" ns="course" />
        ),
        actionLabel: t('button.confirm_stop_sharing'),
        onAction: () => {
          if (!courseDetail) return
          updateSharing({
            detail: courseDetail,
            shareYn: false,
            sharedPassword: null,
          })
        },
      }),
  }

  const onShare = () =>
    openConfirm({
      title: t('confirm.shared_course_title'),
      description: (
        <Trans i18nKey="confirm.shared_course_description" ns="course" />
      ),
      actionLabel: t('button.confirm_shared'),
      onAction: () =>
        navigate({ to: '/course/$courseId/share', params: { courseId } }),
    })

  const shareLinkDrawerProps = {
    open: drawer.open,
    onOpenChange: (open: boolean) =>
      setDrawer((prev) => ({ ...prev, open })),
    sheetTitle: titles[drawer.context].title,
    sheetDescription: titles[drawer.context].description,
    shareLink: `${window.location.origin}/course/shared/${courseId}`,
    password: courseDetail?.sharedPassword ?? null,
  }

  return { isSharing, sharingActions, onShare, shareLinkDrawerProps }
}
