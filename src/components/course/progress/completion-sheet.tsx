import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { CourseDetailItem } from '@/types/course'
import { Trans, useTranslation } from 'react-i18next'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'

interface CompletionSheetProps {
  isOpen: boolean
  onClose: () => void
  variant: 'day' | 'course'
  dayNumber: number
  visitedPlaces: CourseDetailItem[]
  onContinue: () => void
  isPending?: boolean
}

function CompletionSheet({
  isOpen,
  onClose,
  variant,
  dayNumber,
  visitedPlaces,
  onContinue,
  isPending = false,
}: CompletionSheetProps) {
  const { t } = useTranslation('course')
  const isCourse = variant === 'course'
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85vh] w-full max-w-107.5 flex-col rounded-t-3xl bg-bg-main text-text-default p-7">
        <DrawerHeader className="gap-0 p-0 mb-3">
          <DrawerTitle className="!text-title3 text-text-heading text-left">
            {isCourse ? (
              t('completion.completed_title')
            ) : (
              <Trans
                i18nKey="sheet.complete_day_course"
                ns="course"
                values={{ day: dayNumber }}
                components={{ br: <br /> }}
              />
            )}
          </DrawerTitle>
          {isCourse && (
            <DrawerDescription className="text-left text-body2 font-semibold text-text-default">
              {t('completion.completed_description')}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <p className="text-text-subdued text-label mb-2">
          {isCourse
            ? t('completion.visited_places')
            : t('sheet.day_course_spot_list', { day: dayNumber })}
        </p>

        <ul className="flex flex-col gap-2 overflow-y-auto max-h-84">
          {visitedPlaces.map((place) => (
            <li
              key={place.itemId}
              className="flex items-center gap-3 rounded-lg border border-border-1 bg-white p-2.5"
            >
              {place.img ? (
                <img
                  src={place.img}
                  alt={place.name}
                  className="size-14 rounded-md object-cover"
                />
              ) : (
                <div className="size-14 rounded-md bg-gray-200" />
              )}
              <div className="flex flex-col">
                <p className="text-body1 font-semibold text-text-default">
                  {place.name}
                </p>
                <p className="text-label text-text-subdued flex items-center gap-0.5">
                  <MarkerIcon className="size-3" />
                  <span className="text-ellipsis line-clamp-1">
                    {place.address}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <DrawerFooter className="p-0 mt-4">
          <Button onClick={onContinue} disabled={isPending}>
            {isCourse ? t('button.end_course') : t('sheet.start_next_day_button')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CompletionSheet
