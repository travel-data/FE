import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import CourseListItem, { type TransportationType } from './course-list-item'
import { useTranslation } from 'react-i18next'

export interface CoursePlace {
  id: number
  name: string
  address: string
  description: string
  distanceToNext: string | null
  transportToNext: TransportationType | null
}

export interface CourseDay {
  day: number
  label: string
  places: CoursePlace[]
}

interface CourseDayTabsProps {
  days: CourseDay[]
  selectedDay: number
  onDayChange: (day: number) => void
}

function CourseDayTabs({ days, selectedDay, onDayChange }: CourseDayTabsProps) {
  const { t } = useTranslation('course')
  return (
    <Tabs
      value={String(selectedDay)}
      onValueChange={(v) => onDayChange(Number(v))}
      className="gap-0"
    >
      <TabsList className="h-auto gap-2 bg-transparent p-0">
        {days.map((day) => (
          <TabsTrigger
            key={day.day}
            value={String(day.day)}
            className="h-auto flex-none rounded-full px-4 py-1.5 text-label font-semibold after:hidden bg-primary-100 text-brand-primary data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            {t('badge.day_badge_label', { count: day.label })}
          </TabsTrigger>
        ))}
      </TabsList>

      {days.map((day) => (
        <TabsContent
          key={day.day}
          value={String(day.day)}
          className="mt-4 pb-6"
        >
          {day.places.map((place, index) => (
            <CourseListItem
              key={place.id}
              index={index}
              name={place.name}
              address={place.address}
              description={place.description}
              distanceToNext={place.distanceToNext}
              transportToNext={place.transportToNext}
              isLast={index === day.places.length - 1}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default CourseDayTabs
