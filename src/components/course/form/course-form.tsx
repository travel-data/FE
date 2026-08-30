import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortableOperation } from '@dnd-kit/dom/sortable'
import { arrayMove } from '@dnd-kit/helpers'

import ChevronRight from '@/assets/icons/right-arrow-icon.svg?react'
import { Fragment, useRef, useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSortable } from '@dnd-kit/react/sortable'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'

import Marker from '@/assets/icons/maker-icon.svg?react'
import Burger from '@/assets/icons/burger-icon.svg?react'
import Trash from '@/assets/icons/trash-icon.svg?react'
import SPlusIcon from '@/assets/icons/s-plus-icon.svg?react'
import XIcon from '@/assets/icons/x-icon.svg?react'
import EditCourseTransportationSheet from '@/components/course/edit/edit-course-transportation-sheet'
import { Button } from '@/components/ui/button'
import {
  CourseItemPayload,
  PlaceItem,
  TransportationType,
} from '@/types/course'
import transportationIcon from '@/lib/transportation-icon'
import {
  useCourseFormActions,
  useCourseFormStore,
} from '@/stores/course-form-store'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

function PlaceCard({
  place,
  index,
  onDelete,
  canDrag = false,
}: {
  place: PlaceItem
  index: number
  onDelete?: () => void
  canDrag?: boolean
}) {
  const [element, setElement] = useState<Element | null>(null)
  const handleRef = useRef<HTMLButtonElement>(null)
  const placeId = place.spotId ?? place.nearbyPlaceId ?? index
  const { isDragging } = useSortable({
    id: placeId,
    index,
    element,
    handle: handleRef,
    disabled: !canDrag,
  })
  const openConfirm = useConfirmModalStore((s) => s.open)
  const { t } = useTranslation('course')

  return (
    <div
      ref={setElement}
      className={cn(
        'flex items-center rounded-lg border border-gray-200 bg-white p-4',
        isDragging && 'opacity-50',
      )}
    >
        <img
          src={place.img}
          className="mr-4 size-15 shrink-0 rounded-md bg-gray-200"
        />
        <div className="min-w-0 flex-1">
          <p className="text-body1 font-bold text-text-heading">{place.name}</p>
          <div className="mt-0.5 flex items-center gap-1 text-label text-text-subdued">
            <Marker className="size-3 shrink-0" />
            <span className="truncate">{place.address}</span>
          </div>
        </div>
        {canDrag && (
          <button ref={handleRef} className="p-3">
            <Burger className="size-4 shrink-0 fill-text-subdued" />
          </button>
        )}
        {!canDrag && (
          <button
            className="shrink-0 p-3"
            onClick={() =>
              openConfirm({
                title: t('edit.confirm_delete_place_title'),
                description: t('edit.confirm_delete_place_description'),
                cancelLabel: t('button.cancel', { ns: 'common' }),
                actionLabel: t('edit.delete_place_button'),
                onAction: () => onDelete?.(),
              })
            }
          >
            <Trash className="size-5 text-gray-400" />
          </button>
        )}
      </div>
  )
}

function SegmentRow({
  segment,
  segmentIndex,
}: {
  segment: TransportationType | null
  segmentIndex: number
}) {
  const { t } = useTranslation('course')
  const [sheetOpen, setSheetOpen] = useState(false)
  const { setSegment } = useCourseFormActions()
  const type = segment ?? 'WALK'
  const Icon = transportationIcon[type]

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center justify-between rounded-sm bg-primary-50 p-4"
      >
        <div className="flex items-center gap-1.5 text-label text-brand-primary">
          <Icon className="size-3 shrink-0 fill-brand-primary" />
          <span>
            {t('label.transportation', {
              transportation: t(`transportation.${type}`),
            })}
          </span>
        </div>
        <ChevronRight className="size-3 fill-brand-primary" />
      </button>

      {sheetOpen && (
        <EditCourseTransportationSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          defaultValue={type}
          onConfirm={(type) => {
            setSegment({ segmentIndex, type })
            setSheetOpen(false)
          }}
        />
      )}
    </>
  )
}

function CourseForm({
  onSubmit,
  submitLabel,
  isEditMode,
}: {
  onSubmit: (items: CourseItemPayload[]) => void
  submitLabel?: string
  isEditMode?: boolean
}) {
  const { t } = useTranslation('course')
  const navigate = useNavigate()
  const {
    actions: {
      setSelectedDayIndex,
      removePlace,
      setDayPlaces,
      addDays,
      removeDays,
      toPayload,
    },
    days,
    selectedDayIndex,
    initialSnapshot,
  } = useCourseFormStore()

  const openConfirm = useConfirmModalStore((s) => s.open)

  const [dragMode, setDragMode] = useState(false)

  const currentPayload = useMemo(() => toPayload(), [days])
  const hasPlaces = days.some((d) => d.places.length > 0)
  const isUnchanged =
    isEditMode && initialSnapshot === JSON.stringify(currentPayload)
  const isSubmitDisabled = !hasPlaces || isUnchanged

  const goToPlaceSearch = () =>
    navigate({
      to: '/course/place-search',
      search: {
        day: selectedDayIndex + 1,
        courseId: undefined,
        category: undefined,
        keyword: '',
      },
    })

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <Tabs
          value={String(selectedDayIndex)}
          onValueChange={(v) => setSelectedDayIndex(Number(v))}
          className="gap-0"
        >
          <TabsList className="h-auto gap-2 bg-transparent p-0">
            {days.map((_, idx) => (
              <TabsTrigger
                key={idx}
                value={String(idx)}
                className="h-8 gap-1 min-w-16 flex-none rounded-full px-3 py-1.5 text-label font-semibold after:hidden bg-primary-100 text-brand-primary data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                {t('badge.day_badge_label', { count: idx + 1 })}
                {days.length > 1 && days.length === idx + 1 && (
                  <XIcon
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (days[idx].places.length > 0) {
                        openConfirm({
                          title: t('form.delete_day_modal_title', {
                            day: idx + 1,
                          }),
                          description: t('form.delete_day_modal_description'),
                          actionLabel: t('form.confirm_delete_day'),
                          onAction: () => removeDays(),
                        })
                      } else {
                        removeDays()
                      }
                    }}
                    className={cn(
                      selectedDayIndex === idx
                        ? 'fill-primary-50'
                        : 'fill-brand-primary',
                    )}
                  />
                )}
              </TabsTrigger>
            ))}
            {days.length < 3 && (
              <button
                onClick={() => addDays()}
                className="h-8 w-16 flex items-center justify-center rounded-full px-4 py-1.5 text-label font-semibold after:hidden bg-primary-100 "
              >
                <SPlusIcon className="fill-brand-primary" />
              </button>
            )}
          </TabsList>

          {days.map((day, dayIdx) => (
            <TabsContent
              key={dayIdx}
              value={String(dayIdx)}
              className="mt-4 flex flex-col gap-3"
            >
              <DragDropProvider
                onDragEnd={(e) => {
                  if (!isSortableOperation(e.operation)) return
                  const { source } = e.operation
                  if (!source) return
                  setDayPlaces(
                    arrayMove(day.places, source.initialIndex, source.index),
                  )
                }}
              >
                {day.places.map((place, index) => (
                  <Fragment key={place.spotId ?? place.nearbyPlaceId ?? index}>
                    <PlaceCard
                      place={place}
                      index={index}
                      canDrag={dragMode}
                      onDelete={() => removePlace(index)}
                    />
                    {!dragMode && index < day.places.length - 1 && (
                      <SegmentRow
                        segment={day.segments[index] ?? null}
                        segmentIndex={index}
                      />
                    )}
                  </Fragment>
                ))}
              </DragDropProvider>

              {!dragMode && day.places.length < 6 && (
                <Button
                  variant="outline"
                  className="mt-1 w-full"
                  onClick={goToPlaceSearch}
                >
                  {t('edit.add_place_button')}
                </Button>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="p-4 flex w-full gap-4">
        <Button
          variant={dragMode ? 'solid' : 'soft'}
          className="flex-1"
          onClick={() => setDragMode(!dragMode)}
        >
          {dragMode
            ? t('edit.complete_change_order_button')
            : t('edit.change_order_button')}
        </Button>
        {!dragMode && (
          <Button
            className="flex-1"
            disabled={isSubmitDisabled}
            onClick={() => onSubmit(currentPayload)}
          >
            {submitLabel ?? t('edit.course_edit_submit_button')}
          </Button>
        )}
      </div>
    </>
  )
}

export default CourseForm
