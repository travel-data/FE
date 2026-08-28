import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TextInputFormProps {
  title: string | React.ReactNode
  subtitle?: string
  placeholder?: string
  submitLabel?: string
  type?: 'text' | 'password'
  minLength?: number
  onSubmit: (value: string) => void
}

function TextInputForm({
  title,
  subtitle,
  placeholder,
  submitLabel = '입력완료',
  type = 'text',
  minLength = 1,
  onSubmit,
}: TextInputFormProps) {
  const [value, setValue] = useState('')
  const isValid = value.length >= minLength

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="px-5 mb-4">
        <h1 className="whitespace-pre-line text-title1 text-text-heading">
          {title}
        </h1>
        {subtitle && <p className="text-label text-text-subdued">{subtitle}</p>}
      </div>

      <div className="px-5">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
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

export default TextInputForm
