import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import { useFestivalDetailQuery } from '@/hooks/queries/festival'
import { createFileRoute, useParams } from '@tanstack/react-router'

import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import CalendarIcon from '@/assets/icons/calendar-icon.svg?react'
import PhoneIcon from '@/assets/icons/phone-icon.svg?react'
import GlobeIcon from '@/assets/icons/globe-icon.svg?react'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import PlaceDirectionsButton from '@/components/place/place-directions-button'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/festival/$festivalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('festival')
  const { festivalId } = useParams({ from: Route.id })

  const { data, isPending } = useFestivalDetailQuery(Number(festivalId))
  const [mapLoading, mapError] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY ?? '',
  })

  if (isPending || !data)
    return <FestivalDetailSkeleton title={t('title.event_info')} />

  return (
    <section className="flex flex-1 flex-col justify-between h-full">
      <TopBar leftSlot={<BackButton />} title={t('title.event_info')} />
      <div className="px-5 flex-1 h-full flex flex-col">
        <img
          src={data.img}
          alt={data.name}
          className="w-full h-50 rounded-lg mb-3"
        />

        <div className="flex flex-col ">
          <h3 className="text-title3 mb-1.5">{data.name}</h3>

          <div className="space-y-1">
            <p className="flex items-center gap-1">
              <MarkerIcon className="size-3" />
              <span className="text-label text-text-subdued">
                {data.address}
              </span>
            </p>
            <p className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              <span className="text-label text-text-subdued">{`${data.eventStartDate}~${data.eventEndDate}`}</span>
            </p>
            <p className="flex items-center gap-1">
              <PhoneIcon className="size-3" />
              <a
                href={`tel:${data.tel}`}
                className="text-label text-text-subdued underline"
              >
                {data.tel}
              </a>
            </p>

            {data.homepage && (
              <p className="flex items-center gap-1">
                <GlobeIcon className="size-3" />
                <a
                  href={data.homepage}
                  target="_blank"
                  className="text-label text-text-subdued underline"
                >
                  {data.homepage}
                </a>
              </p>
            )}
          </div>

          {data.overview ? (
            <>
              <p className="font-semibold mt-3">
                {t('title.description_title')}
              </p>
              <p className="mt-0.5 text-label text-text-subdued">
                {data.overview}
              </p>
            </>
          ) : (
            <p className="text-body2 text-text-subdued flex items-center justify-center flex-1">
              {t('empty_overview')}
            </p>
          )}
        </div>

        <div className="mt-3">
          <p className="text-body2 text-text-default mb-1 font-semibold">
            {t('label.direction')}
          </p>
          <div className="h-50 relative rounded-lg overflow-hidden ">
            {!mapLoading && !mapError && (
              <Map
                center={{ lat: data.mapY, lng: data.mapX }}
                style={{ width: '100%', height: '100%' }}
                level={5}
              >
                <MapMarker position={{ lat: data.mapY, lng: data.mapX }} />
              </Map>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <PlaceDirectionsButton
          className="w-full"
          latitude={data.mapY}
          longitude={data.mapX}
        />
      </div>
    </section>
  )
}

function FestivalDetailSkeleton({ title }: { title: string }) {
  return (
    <section className="flex flex-1 flex-col justify-between h-full">
      <TopBar leftSlot={<BackButton />} title={title} />
      <div className="px-5 flex-1 h-full flex flex-col">
        <div className="w-full h-50 rounded-lg mb-3 bg-gray-200 animate-pulse" />

        <div className="flex flex-col">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-2.5" />

          <div className="space-y-1.5">
            <div className="h-4 w-52 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-44 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
          </div>

          <div className="h-5 w-20 rounded bg-gray-200 animate-pulse mt-3" />
          <div className="mt-1.5 space-y-1.5">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="mt-3">
          <div className="h-5 w-24 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-50 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="h-13.5 w-full rounded-md bg-gray-200 animate-pulse" />
      </div>
    </section>
  )
}
