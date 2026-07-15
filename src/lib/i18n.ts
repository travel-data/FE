import { STORAGE_KEYS } from '@/constants/storage-key'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const SUPPORTED_LANGUAGES = ['ko', 'en'] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

type LocaleValue = string | { [key: string]: string }
type Resources = Record<string, Record<string, LocaleValue>>

const modules = import.meta.glob('../locales/*/*.json', { eager: true })

const resources: Resources = {}

for (const filePath in modules) {
  const match = filePath.match(/\.\.\/locales\/(\w+)\/(\w+)\.json/)
  if (!match) continue
  const [_, lang, namespace] = match
  const mod = modules[filePath] as { default: LocaleValue }
  if (!resources[lang]) resources[lang] = {}
  resources[lang][namespace] = mod.default
}

function detectInitialLanguage(): SupportedLanguage {
  const savedLanguage = localStorage.getItem(
    STORAGE_KEYS.LANGUAGE,
  ) as SupportedLanguage | null

  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage
  }

  const browserLanguage = navigator.language.split('-')[0]

  if (SUPPORTED_LANGUAGES.includes(browserLanguage as SupportedLanguage)) {
    return browserLanguage as SupportedLanguage
  }

  return 'ko'
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: 'ko',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lang) => {
  console.log(lang)
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang)
})

export default i18n

export { SUPPORTED_LANGUAGES }
export type { SupportedLanguage }
