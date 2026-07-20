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
  return (
    <div className="overflow-x-auto py-2">
      <div className="flex gap-3 px-5">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onDayChange(day)}
            className={
              selectedDay === day
                ? 'shrink-0 rounded-[40px] bg-primary-400 px-4 py-2 text-primary-50'
                : 'shrink-0 rounded-[40px] bg-primary-100 px-4 py-2 text-primary-400'
            }
          >
            {day}일차
          </button>
        ))}
      </div>
    </div>
  )
}

export default CourseDateSelector
