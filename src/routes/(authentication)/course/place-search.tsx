import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import BackButton from '@/components/button/back-button'
import PlaceExploreView from '@/components/place/place-explore-view'
import { Button } from '@/components/ui/button'
import type { PlaceCategory, TourSpotListItem } from '@/types/place'
import { getPlaceId } from '@/types/place'
import { toPlaceItem } from '@/types/course'
import { useCourseFormActions } from '@/stores/course-form-store'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'

export const Route = createFileRoute('/(authentication)/course/place-search')({
  validateSearch: (search: Record<string, unknown>) => ({
    day: Number(search.day ?? 1),
    courseId: search.courseId as string | undefined,
    category: search.category as PlaceCategory | undefined,
    keyword: (search.keyword as string | undefined) ?? '',
  }),
  component: RouteComponent,
})

function useAddPlaceFlow() {
  const { addPlace } = useCourseFormActions()
  const { open: openPlaceDetail, close: closePlaceDetail } =
    usePlaceDetailSheetStore()
  const openConfirm = useConfirmModalStore((s) => s.open)
  const { t } = useTranslation(['course', 'common', 'place'])
  const router = useRouter()

  return (place: TourSpotListItem) =>
    openPlaceDetail(
      getPlaceId(place),
      place.category,
      <Button
        className="w-full flex-1"
        onClick={() => {
          closePlaceDetail()
          openConfirm({
            title: t('confirm.add_course_place_title', { ns: 'course' }),
            description: t('confirm.add_course_place_description', {
              ns: 'course',
            }),
            cancelLabel: t('button.cancel', { ns: 'common' }),
            actionLabel: t('form.add_place_button', { ns: 'course' }),
            onAction: () => {
              addPlace(toPlaceItem(place))
              router.history.back()
            },
          })
        }}
      >
        {t('action.add', { ns: 'place' })}
      </Button>,
    )
}

function RouteComponent() {
  const { category, keyword } = Route.useSearch()
  const openAddPlace = useAddPlaceFlow()

  return (
    <PlaceExploreView
      onSelectPlace={openAddPlace}
      topLeftSlot={<BackButton />}
      initialCategory={category}
      initialKeyword={keyword}
    />
  )
}
