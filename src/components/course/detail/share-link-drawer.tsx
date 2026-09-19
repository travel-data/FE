import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface ShareLinkDrawerProps {
  sheetTitle: string
  sheetDescription: string
  open: boolean
  onOpenChange: (open: boolean) => void
  shareLink: string
  password: string | null
}

interface CopyRowProps {
  label: string
  value: string
}

function CopyRow({ label, value }: CopyRowProps) {
  const { t } = useTranslation(['common', 'course'])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    toast.success(t('course:shared.alert_copy_completed'), { duration: 2000 })
  }

  return (
    <div className="rounded-md bg-gray-100 py-4 px-5">
      <div className="flex items-center justify-between">
        <span className="text-body2 font-semibold text-text-heading">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-label text-text-subdued"
        >
          {t('button.copy')}
        </button>
      </div>
      <p className="mt-1 truncate text-body2 underline text-text-subdued">
        {value}
      </p>
    </div>
  )
}

function ShareLinkDrawer({
  open,
  onOpenChange,
  sheetTitle,
  sheetDescription,
  shareLink,
  password,
}: ShareLinkDrawerProps) {
  const { t } = useTranslation('course')

  const shareText = password
    ? `${shareLink}\n${t('shared.create_course_password')}: ${password}`
    : shareLink

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: shareLink, text: shareText })
    } else {
      navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
    >
      <DrawerContent className="p-7">
        <DrawerHeader className="gap-1 p-0 mb-5 text-left">
          <DrawerTitle className="text-title3 font-bold text-text-heading">
            {sheetTitle}
          </DrawerTitle>
          <DrawerDescription className="text-body2 text-text-subdued">
            {sheetDescription}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-3 mb-4">
          <CopyRow label={t('shared.create_course_link')} value={shareLink} />
          {password && (
            <CopyRow
              label={t('shared.create_course_password')}
              value={password}
            />
          )}
        </div>

        <DrawerFooter className="flex-row gap-3 p-0">
          <DrawerClose asChild>
            <Button variant="soft" className="flex-1">
              {t('shared.close_option_sheet')}
            </Button>
          </DrawerClose>
          <Button className="flex-1" onClick={handleShare}>
            {t('button.confirm_shared')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ShareLinkDrawer
