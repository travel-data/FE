import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '../ui/drawer'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import PlaceBookmarkButton from './place-bookmark-button'
import { Button } from '../ui/button'
import DownloadIcon from '@/assets/icons/download-icon.svg?react'
import PlaceDirectionsButton from './place-directions-button'
import { useTranslation } from 'react-i18next'
import { PlaceCategory, TourSpotDetail, NearbyPlaceDetail } from '@/types/place'
import { usePlaceDetail } from '@/hooks/queries/place'

function TourSpotSheet({ data }: { data: TourSpotDetail }) {
  return (
    <>
      <DrawerHeader className="flex justify-between items-center p-0">
        <div className="flex flex-col gap-0.5 items-start">
          <h2 className="text-title3 text-text-default">{data.name}</h2>
          <p className="flex items-center gap-0.5">
            <MarkerIcon className="size-3" />
            <span className="text-label text-text-subdued">{data.address}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="icon" size="icon" className="size-10">
            <DownloadIcon />
          </Button>
          <PlaceBookmarkButton
            placeId={data.spotId}
            category="TOUR_SPOT"
            isBookmarked={data.like}
          />
        </div>
      </DrawerHeader>

      <div className="space-y-3.5">
        {data.img ? (
          <img
            className="h-56.75 w-full rounded-md object-cover"
            src={data.img}
            alt={data.name}
          />
        ) : (
          <div className="h-56.75 w-full flex items-center justify-center rounded-md bg-gray-200">
            <p className="text-label text-text-subdued">
              이미지가 존재하지 않습니다.
            </p>
          </div>
        )}
        <p className="text-label text-text-subdued max-h-40 overflow-scroll">
          {data.overview}
        </p>
      </div>
    </>
  )
}

function NearbyPlaceSheet({ data }: { data: NearbyPlaceDetail }) {
  return (
    <>
      <DrawerHeader className="flex justify-between items-center p-0">
        <div className="flex flex-col gap-0.5 items-start">
          <h2 className="text-title3 text-text-default">{data.name}</h2>
          <p className="flex items-center gap-0.5">
            <MarkerIcon className="size-3" />
            <span className="text-label text-text-subdued">{data.address}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PlaceBookmarkButton
            placeId={data.nearbyPlaceId}
            category={data.category}
            isBookmarked={false}
          />
        </div>
      </DrawerHeader>

      <div className="space-y-3.5">
        {data.img ? (
          <img
            className="h-56.75 w-full rounded-md object-cover"
            src={data.img}
            alt={data.name}
          />
        ) : (
          <div className="h-56.75 w-full flex items-center justify-center rounded-md bg-gray-200">
            <p className="text-label text-text-subdued">
              이미지가 존재하지 않습니다.
            </p>
          </div>
        )}
        {data.overview && (
          <p className="text-label text-text-subdued max-h-40 overflow-scroll">
            {data.overview}
          </p>
        )}
        {data.mood && (
          <p className="text-label text-text-subdued">{data.mood}</p>
        )}
        {data.openTime && (
          <p className="text-label text-text-subdued">
            영업시간: {data.openTime}
          </p>
        )}
      </div>
    </>
  )
}

interface PlaceDetailSheetProps {
  isOpen: boolean
  onClose: () => void
  placeId: number
  actionButton?: React.ReactNode
  placeCategory: PlaceCategory
}

function PlaceDetailSheet({
  isOpen,
  onClose,
  placeId,
  actionButton,
  placeCategory,
}: PlaceDetailSheetProps) {
  const { t } = useTranslation('common')

  const { isTourSpot, tourSpotData, nearbyData, isPending } = usePlaceDetail({
    placeId,
    category: placeCategory,
    enabled: isOpen,
  })

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-7 gap-4">
        {isPending && !tourSpotData && !nearbyData && (
          <>
            <div className="flex justify-between items-center p-0">
              <div className="flex flex-col gap-2 items-start">
                <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-45 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="size-10 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="h-56.75 w-full rounded-md bg-gray-200 animate-pulse" />
              <div className="flex flex-col space-y-2">
                <div className="bg-gray-200 w-full rounded-md h-7" />
                <div className="bg-gray-200 w-full rounded-md h-7" />
                <div className="bg-gray-200 w-full rounded-md h-7" />
                <div className="bg-gray-200 w-3/5 rounded-md h-7" />
              </div>
            </div>
          </>
        )}
        {isTourSpot && tourSpotData && <TourSpotSheet data={tourSpotData} />}
        {!isTourSpot && nearbyData && <NearbyPlaceSheet data={nearbyData} />}

        <DrawerFooter className="p-0 flex-row items-center gap-4">
          {isPending && !tourSpotData && !nearbyData ? (
            <>
              <div className="h-13.5 flex-1 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-13.5 flex-1 rounded-md bg-gray-200 animate-pulse" />
            </>
          ) : (
            <>
              <PlaceDirectionsButton
                latitude={tourSpotData?.mapY ?? nearbyData?.mapY ?? 0}
                longitude={tourSpotData?.mapX ?? nearbyData?.mapX ?? 0}
              />
              {actionButton ?? (
                <Button onClick={onClose} variant="solid" className="flex-1">
                  {t('button.close')}
                </Button>
              )}
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PlaceDetailSheet
