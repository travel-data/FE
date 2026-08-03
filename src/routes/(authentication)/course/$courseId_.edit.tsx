import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import transportationIcon from '@/lib/transportation-icon'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Fragment, useRef, useState } from 'react'
import { type TransportationType } from '@/components/course/detail/course-list-item'
import Marker from '@/assets/icons/maker-icon.svg?react'
import Burger from '@/assets/icons/burger-icon.svg?react'
import Trash from '@/assets/icons/trash-icon.svg?react'
import ChevronRight from '@/assets/icons/right-arrow-icon.svg?react'
import EditCourseTransportationSheet from '@/components/course/edit/edit-course-transportation-sheet'
import DeleteCoursePlaceConfirmModal from '@/components/course/edit/delete-course-place-confirm-modal'
import { useSortable } from '@dnd-kit/react/sortable'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/edit',
)({
  component: RouteComponent,
})

interface CoursePlaceEdit {
  id: number
  name: string
  address: string
}

interface CourseDayEdit {
  day: number
  places: CoursePlaceEdit[]
  segments: (TransportationType | null)[]
}

const MOCK_DAYS: CourseDayEdit[] = [
  {
    day: 1,
    places: [
      { id: 1, name: '첨성대', address: '경북 경주시 첨성로 169-5' },
      { id: 2, name: '동궁과 월지', address: '경북 경주시 원화로 102' },
      { id: 3, name: '월정교', address: '경북 경주시 교동 274-1' },
    ],
    segments: ['bicycle', 'car'],
  },
  {
    day: 2,
    places: [
      { id: 4, name: '불국사', address: '경북 경주시 불국로 385' },
      { id: 5, name: '석굴암', address: '경북 경주시 불국로 873-243' },
      { id: 6, name: '경주 국립박물관', address: '경북 경주시 일정로 186' },
    ],
    segments: ['car', 'car'],
  },
  {
    day: 3,
    places: [
      { id: 7, name: '대릉원', address: '경북 경주시 계림로 9' },
      { id: 8, name: '월성 해자', address: '경북 경주시 인왕동 387-1' },
    ],
    segments: ['walk'],
  },
]

const TRANSPORT_LABELS: Record<TransportationType, string> = {
  walk: '도보로 이동',
  bicycle: '자전거로 이동',
  car: '자동차로 이동',
}

function RouteComponent() {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState(1)
  const [days, setDays] = useState<CourseDayEdit[]>(MOCK_DAYS)
  const [dragMode, setDragMode] = useState(false)

  const { t } = useTranslation('course')
  return (
    <section className="flex h-svh flex-col">
      <TopBar leftSlot={<BackButton />} title="코스 수정" />
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <Tabs
          value={String(selectedDay)}
          onValueChange={(v) => setSelectedDay(Number(v))}
          className="gap-0"
        >
          <TabsList className="h-auto gap-2 bg-transparent p-0">
            {days.map((day) => (
              <TabsTrigger
                key={day.day}
                value={String(day.day)}
                className="h-auto flex-none rounded-full px-4 py-1.5 text-label font-semibold after:hidden bg-primary-100 text-brand-primary data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                {t('badge.day_badge_label', { count: day.day })}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => (
            <TabsContent
              key={day.day}
              value={String(day.day)}
              className="mt-4 flex flex-col gap-3"
            >
              <DragDropProvider
                onDragEnd={(e) => {
                  setDays((prev) =>
                    prev.map((d) =>
                      d.day === day.day
                        ? { ...d, places: move(d.places, e) }
                        : d,
                    ),
                  )
                }}
              >
                {day.places.map((place, index) => (
                  <Fragment key={place.id}>
                    <PlaceCard place={place} index={index} canDrag={dragMode} />
                    {!dragMode && index < day.places.length - 1 && (
                      <SegmentRow segment={day.segments[index] ?? null} />
                    )}
                  </Fragment>
                ))}
              </DragDropProvider>

              {!dragMode && (
                <Button
                  variant="outline"
                  className="mt-1 w-full"
                  onClick={() =>
                    navigate({
                      to: '/course/$courseId/place-search',
                      params: { courseId },
                      search: { day: day.day },
                    })
                  }
                >
                  {t('edit.add_place_button')}
                </Button>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      s
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
          <Button className="flex-1">
            {t('edit.course_edit_submit_button')}
          </Button>
        )}
      </div>
    </section>
  )
}

function PlaceCard({
  place,
  index,
  onDelete,
  canDrag = false,
}: {
  place: CoursePlaceEdit
  index: number
  onDelete?: () => void
  canDrag?: boolean
}) {
  const [element, setElement] = useState<Element | null>(null)
  const handleRef = useRef<HTMLButtonElement>(null)
  const { isDragging } = useSortable({
    id: place.id,
    index,
    element,
    handle: handleRef,
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  return (
    <>
      <div
        ref={setElement}
        className={cn(
          'flex items-center rounded-lg border border-gray-200 bg-white p-4',
          isDragging && 'opacity-50',
        )}
      >
        <div className="mr-4 size-15 shrink-0 rounded-md bg-gray-200" />
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
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash className="size-5 text-gray-400" />
          </button>
        )}
      </div>

      <DeleteCoursePlaceConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => onDelete?.()}
      />
    </>
  )
}

function SegmentRow({ segment }: { segment: TransportationType | null }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const iconKey =
    segment && segment in transportationIcon
      ? (segment as keyof typeof transportationIcon)
      : null
  const Icon = iconKey ? transportationIcon[iconKey] : null

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center justify-between rounded-sm bg-primary-50 p-4"
      >
        <div className="flex items-center gap-1.5 text-label text-brand-primary">
          {Icon && <Icon className="size-3 shrink-0 fill-brand-primary" />}
          <span>{segment ? TRANSPORT_LABELS[segment] : '이동 수단 선택'}</span>
        </div>
        <ChevronRight className="size-3 fill-brand-primary" />
      </button>

      {sheetOpen && (
        <EditCourseTransportationSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          defaultValue={segment ?? undefined}
          onConfirm={() => {}}
        />
      )}
    </>
  )
}
