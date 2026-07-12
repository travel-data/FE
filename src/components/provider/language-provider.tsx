import React, { createContext, useContext, useEffect, useState } from 'react'
import { LanguageBottomSheet } from '../bottom-sheet/language-bottom-sheet'
import { STORAGE_KEYS } from '@/constants/storage-key'
import { SupportedLanguage } from '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import ChangeLanguageBottomSheet from '../bottom-sheet/change-language-bottom-sheet'

type SheetMode = 'onbording' | 'settings' | null

type LanguageProviderContextType = {
  sheetMode: SheetMode
  setSheetMode: (mode: SheetMode) => void
  changeLanguage: (lang: SupportedLanguage) => void
  closeSheet: () => void
}

export const LanguageProvderContext =
  createContext<LanguageProviderContextType | null>(null)
interface LanguageProviderProps {
  children: React.ReactNode
}

export const useLanguage = () => {
  const ctx = useContext(LanguageProvderContext)

  if (!ctx) throw new Error('not found languange provider context')

  return ctx
}

function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation()
  const [sheetMode, setSheetMode] = useState<SheetMode>(null)

  const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE)

  useEffect(() => {
    if (!savedLanguage) {
      setSheetMode('onbording')
    }
  }, [])

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
  }

  const closeSheet = () => {
    setSheetMode(null)
  }

  return (
    <LanguageProvderContext.Provider
      value={{
        sheetMode,
        closeSheet,
        setSheetMode: (mode) => setSheetMode(mode),
        changeLanguage,
      }}
    >
      {children}
      {sheetMode === 'onbording' && (
        <LanguageBottomSheet isOpen={sheetMode === 'onbording'} />
      )}
      {sheetMode === 'settings' && (
        <ChangeLanguageBottomSheet
          isOpen={sheetMode === 'settings'}
          onClose={closeSheet}
        />
      )}
    </LanguageProvderContext.Provider>
  )
}

export default LanguageProvider
