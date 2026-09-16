import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '../ui/drawer'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import PlaceBookmarkButton from './place-bookmark-button'
import { Button } from '../ui/button'
import DownloadIcon from '@/assets/icons/download-icon.svg?react'
import PlaceDirectionsButton from './place-directions-button'
import { useTranslation } from 'react-i18next'
import { PlaceCategory, TourSpotDetail, NearbyPlaceDetail } from '@/types/place'
import { usePlaceDetail } from '@/hooks/queries/place'
import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const TOUR_IMAGE_HOST = 'tong.visitkorea.or.kr'
const TOUR_IMAGE_PROXY_PATH = '/tour-image-proxy'
const CAPTURE_IMAGE_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect width="100%25" height="100%25" fill="%23f0f1f4"/%3E%3C/svg%3E'

function createImageFileName(placeName: string) {
  const safePlaceName = placeName.trim().replace(/[\\/:*?"<>|]/g, '-')
  return `${safePlaceName || '관광지'}.png`
}

function getCaptureSafeImageUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl)

    if (url.hostname !== TOUR_IMAGE_HOST) return imageUrl

    return `${TOUR_IMAGE_PROXY_PATH}${url.pathname}${url.search}`
  } catch {
    return imageUrl
  }
}

function TourSpotSheet({
  data,
  readOnly,
}: {
  data: TourSpotDetail
  readOnly?: boolean
}) {
  const captureRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!captureRef.current || isDownloading) return

    setIsDownloading(true)

    try {
      await document.fonts.ready

      const imageUrl = await toPng(captureRef.current, {
        backgroundColor: '#fdfbfa',
        cacheBust: true,
        imagePlaceholder: CAPTURE_IMAGE_PLACEHOLDER,
        pixelRatio: Math.min(window.devicePixelRatio || 2, 3),
        style: { margin: '0' },
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            node.dataset.captureExclude === 'true'
          ),
      })

      const downloadLink = document.createElement('a')
      downloadLink.download = createImageFileName(data.name)
      downloadLink.href = imageUrl
      downloadLink.click()

      toast.success('관광지 이미지를 저장했습니다.')
    } catch {
      toast.error('이미지를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div ref={captureRef} className="-m-3.5 space-y-4 bg-bg-main p-3.5">
      <DrawerHeader className="flex justify-between items-center p-0">
        <div className="flex flex-col gap-0.5 items-start">
          <h2 className="text-title3 text-text-default">{data.name}</h2>
          <p className="flex items-center gap-0.5">
            <MarkerIcon className="size-2.5" />
            <span className="text-caption text-text-subdued">
              {data.address}
            </span>
          </p>
        </div>
        {!readOnly && (
          <div
            data-capture-exclude="true"
            className="flex items-center gap-2"
          >
            <Button
              variant="icon"
              size="icon"
              className="size-10"
              aria-label="관광지 이미지 다운로드"
              aria-busy={isDownloading}
              disabled={isDownloading}
              onClick={handleDownload}
            >
              <DownloadIcon />
            </Button>
            <PlaceBookmarkButton
              placeId={data.spotId}
              category="TOUR_SPOT"
              isBookmarked={data.like}
            />
          </div>
        )}
      </DrawerHeader>

      <div className="space-y-3.5">
        {data.img ? (
          <img
            className="h-56.75 w-full rounded-md object-cover"
            src={getCaptureSafeImageUrl(data.img)}
            alt={data.name}
          />
        ) : (
          <div className="h-56.75 w-full flex items-center justify-center rounded-md bg-gray-200">
            <p className="text-label text-text-subdued">
              이미지가 존재하지 않습니다.
            </p>
          </div>
        )}
        <p className="text-label text-text-subdued overflow-scroll">
          {data.overview}
        </p>
      </div>
    </div>
  )
}

function NearbyPlaceSheet({
  data,
  readOnly,
}: {
  data: NearbyPlaceDetail
  readOnly?: boolean
}) {
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
        {!readOnly && (
          <div className="flex items-center gap-2">
            <PlaceBookmarkButton
              placeId={data.nearbyPlaceId}
              category={data.category}
              isBookmarked={data.like}
            />
          </div>
        )}
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
        {data.homepageUrl && data.homepageUrl}
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
  readOnly?: boolean
}

function PlaceDetailSheet({
  isOpen,
  onClose,
  placeId,
  actionButton,
  placeCategory,
  readOnly = false,
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
        {isTourSpot && tourSpotData && (
          <TourSpotSheet data={tourSpotData} readOnly={readOnly} />
        )}
        {!isTourSpot && nearbyData && (
          <NearbyPlaceSheet data={nearbyData} readOnly={readOnly} />
        )}

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
