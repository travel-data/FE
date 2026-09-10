import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useTranslation } from 'react-i18next'
import CarIcon from '@/assets/icons/car-icon.svg?react'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import type { CourseDetailItem, TransportationType } from '@/types/course'
import type { RouteTransportType } from '@/types/route'
import { useRouteCalculation } from '@/hooks/queries/movement'

const TRANSPORT_TYPE_MAP: Record<TransportationType, RouteTransportType> = {
  WALK: 'WALK',
  CAR: 'CAR',
  BIKE: 'BICYCLE',
}

const KAKAO_BY_MAP: Record<RouteTransportType, string> = {
  WALK: 'foot',
  CAR: 'car',
  BICYCLE: 'bicycle',
  PUBLIC_TRANSIT: 'publictransit',
}

interface NextPlaceSheetProps {
  isOpen: boolean
  onClose: () => void
  place: CourseDetailItem
  origin: { latitude: number; longitude: number }
  onMove: () => void
  onSkip: () => void
  disableSkip?: boolean
  isPending: boolean
}

function NextPlaceSheet({
  isOpen,
  onClose,
  place,
  origin,
  onMove,
  onSkip,
  disableSkip = false,
  isPending,
}: NextPlaceSheetProps) {
  const transportType = TRANSPORT_TYPE_MAP[place.transportType ?? 'WALK']
  const { data: route, isPending: isRoutePending } = useRouteCalculation({
    origin,
    destination: { latitude: place.latitude, longitude: place.longitude },
    transportType,
  })

  const directionsUrl = `http://m.map.kakao.com/scheme/route?sp=${origin.latitude},${origin.longitude}&ep=${place.latitude},${place.longitude}&by=${KAKAO_BY_MAP[transportType]}`

  const { t } = useTranslation('course')
  const transportLabel = t(`transportation.${place.transportType ?? 'WALK'}`)
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-107.5 flex-col rounded-t-3xl bg-bg-main  text-text-default p-7">
        <DrawerHeader className=" gap-0 p-0 mb-2">
          <DrawerTitle className="!text-title3 text-text-heading text-left">
            {t('confirm.next_place')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-center">
            <h4 className="text-title3 ">{place.name}</h4>
          </div>

          <div className="">
            <p className="text-text-subdued flex items-center gap-1 mb-0.5">
              <CarIcon className="fill-text-subdued" />
              <span className="text-label">
                {t('label.estimated')} · {transportLabel}{' '}
                {isRoutePending ? (
                  <span className="inline-block h-3 w-16 animate-pulse rounded bg-gray-200 align-middle" />
                ) : (
                  (route?.durationText ?? '-')
                )}
              </span>
            </p>

            <p className="flex items-center gap-1 text-text-subdued text-label">
              <MarkerIcon className="size-3" />
              <span>
                {place.address} · {''}
                <a
                  className="text-brand-primary font-bold"
                  target="_blank"
                  href={directionsUrl}
                >
                  {t('button.directions', { ns: 'course' })}
                </a>
              </span>
            </p>
          </div>

          {place.img ? (
            <img
              src={place.img}
              alt={place.name}
              className="h-44 rounded-xl my-4 w-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 h-44 rounded-xl my-4" />
          )}
        </div>

        <DrawerFooter className="p-0 flex-row items-center gap-4">
          <Button
            className="flex-1"
            variant={'soft'}
            onClick={onSkip}
            disabled={isPending || disableSkip}
          >
            {t('button.skip')}
          </Button>
          <Button className="flex-1" onClick={onMove} disabled={isPending}>
            {t('button.move')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default NextPlaceSheet
