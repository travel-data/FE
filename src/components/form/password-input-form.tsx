import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface PasswordInputFormProps {
  title: string | React.ReactNode
  subtitle?: string
  submitLabel?: string
  onSubmit: (password: string) => void
}

function PasswordInputForm({
  title,
  subtitle,
  submitLabel = '입력완료',
  onSubmit,
}: PasswordInputFormProps) {
  const { t } = useTranslation('course')

  const [value, setValue] = useState('')
  const isValid = value.length >= 4

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="px-5 mb-6">
        <h1 className="whitespace-pre-line text-title1 text-text-heading">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-label text-text-subdued">{subtitle}</p>
        )}
      </div>

      <div className="px-5">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('shared.password_input_placeholder')}
          className="w-full rounded-md h-13 bg-gray-200 px-4 py-3 text-label text-text-default outline-none placeholder:text-text-subdued"
        />
      </div>

      <div className="mt-auto p-5">
        <Button type="submit" className="w-full" disabled={!isValid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default PasswordInputForm
