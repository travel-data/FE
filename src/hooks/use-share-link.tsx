import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'

type ShareLinkContext = 'created' | 'view' | 'edited'

export function useShareLink({
  shareYn,
  courseId,
}: {
  shareYn: boolean
  courseId: string
}) {
  const { t } = useTranslation('course')
  const location = useLocation()
  const navigate = useNavigate()
  const openConfirm = useConfirmModalStore((s) => s.open)

  const [isSharing, setIsSharing] = useState(shareYn)
  const [drawer, setDrawer] = useState<{ open: boolean; context: ShareLinkContext }>({
    open: false,
    context: 'created',
  })

  const openDrawer = (context: ShareLinkContext) =>
    setDrawer({ open: true, context })

  useEffect(() => {
    if (location.state?.shareSuccess) {
      setIsSharing(true)
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

  const titles: Record<ShareLinkContext, { title: string; description: string }> = {
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
        description: <Trans i18nKey="confirm.stop_sharing_description" ns="course" />,
        actionLabel: t('button.confirm_stop_sharing'),
        onAction: () => setIsSharing(false),
      }),
  }

  const onShare = () =>
    openConfirm({
      title: t('confirm.shared_course_title'),
      description: <Trans i18nKey="confirm.shared_course_description" ns="course" />,
      actionLabel: t('button.confirm_shared'),
      onAction: () =>
        navigate({ to: '/course/$courseId/share', params: { courseId } }),
    })

  const shareLinkDrawerProps = {
    open: drawer.open,
    onOpenChange: (open: boolean) => setDrawer((prev) => ({ ...prev, open })),
    sheetTitle: titles[drawer.context].title,
    sheetDescription: titles[drawer.context].description,
  }

  return { isSharing, setIsSharing, sharingActions, onShare, shareLinkDrawerProps }
}
