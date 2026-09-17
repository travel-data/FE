import { useTranslation } from 'react-i18next'

interface CourseDateSelectorProps {
  selectedDay: number
  totalDays: number
  onDayChange: (day: number) => void
}

function CourseDateSelector({
  selectedDay,
  totalDays,
  onDayChange,
}: CourseDateSelectorProps) {
  const { t } = useTranslation('course')

  return (
    <div className="overflow-x-auto mb-5">
      <div className="flex gap-2 px-5">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onDayChange(day)}
            className={
              selectedDay === day
                ? 'shrink-0 rounded-full bg-brand-primary px-4 py-1.5 text-label font-semibold text-white'
                : 'shrink-0 rounded-full bg-primary-100 px-4 py-1.5 text-label font-semibold text-brand-primary'
            }
          >
            {t('badge.day_badge_label', { count: day })}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CourseDateSelector
