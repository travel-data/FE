import { Drawer, DrawerContent, DrawerHeader } from '../ui/drawer'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../provider/language-provider'

interface ChangeLanguageBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

function ChangeLanguageBottomSheet({
  isOpen,
  onClose,
}: ChangeLanguageBottomSheetProps) {
  const { t } = useTranslation('common')

  const { changeLanguage } = useLanguage()
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="p-7">
          <h2 className="text-title3 text-left">
            {t('confirm.change_language')}
          </h2>
        </DrawerHeader>

        <div className="mt-auto flex flex-col gap-2.5 px-7 pb-7">
          <button
            onClick={() => {
              changeLanguage('ko')
              onClose()
            }}
            type="button"
            className=" w-full rounded-md border border-border-1 p-4 text-left text-body2 text-text-default"
          >
            {t('button.korean')}
          </button>
          <button
            onClick={() => {
              changeLanguage('en')
              onClose()
            }}
            type="button"
            className=" w-full rounded-md border border-border-1 p-4 text-left text-body2 text-text-default"
          >
            {t('button.english')}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ChangeLanguageBottomSheet
