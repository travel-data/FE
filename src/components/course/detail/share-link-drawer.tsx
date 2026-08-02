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

const MOCK_SHARE_LINK = 'https://oiso.co.kr/course/shared/60381abc'
const MOCK_PASSWORD = '12521'

interface ShareLinkDrawerProps {
  sheetTitle: string
  sheetDescription: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CopyRowProps {
  label: string
  value: string
}

function CopyRow({ label, value }: CopyRowProps) {
  const { t } = useTranslation('common')

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
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
}: ShareLinkDrawerProps) {
  const { t } = useTranslation('course')

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        url: MOCK_SHARE_LINK,
        text: `공유 비밀번호: ${MOCK_PASSWORD}`,
      })
    } else {
      navigator.clipboard.writeText(
        `${MOCK_SHARE_LINK}\n공유 비밀번호: ${MOCK_PASSWORD}`,
      )
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
          <CopyRow
            label={t('shared.create_course_link')}
            value={MOCK_SHARE_LINK}
          />
          <CopyRow
            label={t('shared.create_course_password')}
            value={MOCK_PASSWORD}
          />
        </div>

        <DrawerFooter className="flex-row gap-3 p-0">
          <DrawerClose asChild>
            <Button variant="soft" className="flex-1">
              {t('button.cancel', { ns: 'common' })}
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
