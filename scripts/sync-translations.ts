import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { google } from 'googleapis'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// constants
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME
const SERVICE_ACCOUNT_FILE = 'oiso-i18n-service-account.json'
const OUTPUT_DIR = path.join(__dirname, '../src/locales')
const LANGUAGES = ['ko', 'en'] as const
// types
type LocaleTree = Record<string, unknown>
type LangResult = {
  ko: Record<string, LocaleTree>
  en: Record<string, LocaleTree>
}

async function main(): Promise<void> {
  if (!SPREADSHEET_ID) {
    throw new Error('not found spreadsheet id')
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, SERVICE_ACCOUNT_FILE),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!B:E`,
  })

  const rows = res.data.values

  if (!rows || rows.length === 0) {
    console.warn('not found rows')
    return
  }

  const dataRows = rows.slice(2).filter((row) => row[0] && row[1])

  const result: LangResult = { ko: {}, en: {} }

  for (const row of dataRows) {
    const [namespace, key, ko, en] = row

    if (!namespace || !key) continue

    if (!result.ko[namespace]) result.ko[namespace] = {}
    if (!result.en[namespace]) result.en[namespace] = {}

    setNestedValue(result.ko[namespace] as LocaleTree, key, ko)
    setNestedValue(result.en[namespace] as LocaleTree, key, en)
  }

  for (const lang of LANGUAGES) {
    const langDir = path.join(OUTPUT_DIR, lang)
    fs.mkdirSync(langDir, { recursive: true })

    for (const [namespace, content] of Object.entries(result[lang])) {
      const filePath = path.join(langDir, `${namespace}.json`)

      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
    }
  }
  console.log('json file created success')
}

// key, value 중첩 객체 구조로 변환
function setNestedValue(obj: LocaleTree, key: string, value: string) {
  const keys = key.split('.')
  let current: LocaleTree = obj
  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      current[key] = value
    } else {
      current[key] = (current[key] as LocaleTree) || {}
      current = current[key] as LocaleTree
    }
  })
}

main().catch(console.error)
