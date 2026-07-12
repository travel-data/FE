import {
  DrawerHeader,
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '../ui/drawer'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../provider/language-provider'
import { SupportedLanguage } from '@/lib/i18n'

interface LanguageBottomSheetProps {
  isOpen: boolean
}

export function LanguageBottomSheet({ isOpen }: LanguageBottomSheetProps) {
  const { closeSheet, changeLanguage } = useLanguage()

  const {
    t,
    i18n: { language },
  } = useTranslation('common')

  const isKorean = language === 'ko'

  return (
    <Drawer open={isOpen} dismissible={false}>
      <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-107.5 flex-col rounded-t-3xl bg-bg-main  text-text-default">
        <DrawerHeader className=" gap-0 mb-8  pb-0 pt-8 px-7">
          <DrawerTitle className="!text-title3 text-text-heading">
            {t('setting.confirm_language_title', {
              language: isKorean ? '한국어' : 'English',
            })}
          </DrawerTitle>
          <DrawerDescription className="text-label text-text-subdued">
            {t('setting.confirm_language_description')}
          </DrawerDescription>
        </DrawerHeader>
        <div className="mt-auto flex flex-col gap-2.5 p-7">
          <button
            type="button"
            onClick={() => {
              changeLanguage(language as SupportedLanguage)
              closeSheet()
            }}
            className=" w-full rounded-md border border-border-1 p-4 text-left text-body2 text-text-default"
          >
            {t('setting.confirm_button')}
          </button>
          <button
            type="button"
            onClick={() => {
              changeLanguage(isKorean ? 'en' : 'ko')
            }}
            className=" w-full rounded-md border border-border-1 p-4 text-left text-body2 text-text-default"
          >
            {t('setting.select_another_language', {
              language: isKorean ? '영어' : 'Korean',
            })}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
