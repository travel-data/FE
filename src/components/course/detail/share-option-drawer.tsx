import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import RightArrowIcon from '@/assets/icons/right-arrow-icon.svg?react'
import { Button } from '@/components/ui/button'

interface ShareOptionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onViewLink: () => void
  onEditPassword: () => void
  onStopSharing: () => void
}

function ShareOptionDrawer({
  isOpen,
  onClose,
  onViewLink,
  onEditPassword,
  onStopSharing,
}: ShareOptionDrawerProps) {
  const { t } = useTranslation('course')

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-bg-main text-text-default p-7">
        <DrawerHeader className="text-left p-0 gap-0.5 mb-4">
          <DrawerTitle className="text-title3 ">
            {t('shared.alert_sharing_active_title')}
          </DrawerTitle>
          <DrawerDescription className="text-body2 text-text-subdued">
            {t('shared.alert_sharing_active_description')}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 mb-4">
          <ShareOptionButton
            onClick={onViewLink}
            title={t('shared.check_share_link_button')}
            description={
              <Trans
                i18nKey={'shared.check_share_link_button_description'}
                ns="course"
              />
            }
          />
          <ShareOptionButton
            onClick={onEditPassword}
            title={t('shared.edit_password_button')}
            description={
              <Trans
                i18nKey={'shared.edit_password_button_description'}
                ns="course"
              />
            }
          />
          <ShareOptionButton
            onClick={onStopSharing}
            title={t('shared.stop_sharing_button')}
            description={
              <Trans
                i18nKey={'shared.stop_sharing_button_description'}
                ns="course"
              />
            }
          />
        </div>

        <Button onClick={onClose}>{t('shared.close_option_sheet')}</Button>
      </DrawerContent>
    </Drawer>
  )
}

export default ShareOptionDrawer

function ShareOptionButton({
  title,
  description,
  onClick,
}: {
  title: string
  description: string | React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-between p-4 rounded-md border border-border-1 bg-white"
      onClick={onClick}
    >
      <div className="flex flex-col gap-0.5 text-left">
        <h4 className="text-body1 font-semibold text-text-heading">{title}</h4>
        <p className="text-label text-text-subdued">{description}</p>
      </div>

      <RightArrowIcon />
    </button>
  )
}
