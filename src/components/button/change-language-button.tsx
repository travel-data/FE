import Globe from '@/assets/icons/globe-icon.svg?react'

import { Button } from '../ui/button'
import { useLanguage } from '../provider/language-provider'

function ChangeLanguageButton() {
  const { setSheetMode } = useLanguage()

  return (
    <>
      <Button
        onClick={() => setSheetMode('settings')}
        variant={'icon'}
        size="icon"
      >
        <Globe />
      </Button>
    </>
  )
}

export default ChangeLanguageButton
