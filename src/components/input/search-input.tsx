import SearchIcon from '@/assets/icons/search-icon.svg?react'
import CircleXIcon from '@/assets/icons/circle-x-icon.svg?react'
import { useTranslation } from 'react-i18next'

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  placeholder?: string
}

function SearchInput({ value = '', onChange, onClear, placeholder }: SearchInputProps) {
  const { t } = useTranslation('common')

  const handleClear = () => {
    onChange?.('')
    onClear?.()
  }

  return (
    <div className="bg-white px-4 h-11 rounded-[14px] flex flex-1 items-center w-full gap-3">
      <SearchIcon className="shrink-0" />
      <input
        type="text"
        className="outline-none w-full text-label"
        placeholder={placeholder ?? t('input.search_placeholder')}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {value && (
        <CircleXIcon className="shrink-0 cursor-pointer" onClick={handleClear} />
      )}
    </div>
  )
}

export default SearchInput
