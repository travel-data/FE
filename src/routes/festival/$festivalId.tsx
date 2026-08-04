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

export const Route = createFileRoute('/festival/$festivalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { festivalId } = useParams({ from: Route.id })

  const { data, isPending } = useFestivalDetailQuery(Number(festivalId))
  const [mapLoading, mapError] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY ?? '',
  })

  //   TODO : 스켈레톤 적용 필요
  if (isPending || !data) return null

  return (
    <section className="flex flex-1 flex-col justify-between h-full">
      <TopBar leftSlot={<BackButton />} title="행사 정보" />
      <div className="px-5 flex-1 h-full flex flex-col">
        <img
          src={data.img}
          alt={data.name}
          className="w-full h-50 rounded-lg mb-3"
        />

        <div className="flex-1 flex flex-col ">
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
            <p className="mt-2 text-label text-text-subdued">{data.overview}</p>
          ) : (
            <p className="text-body2 text-text-subdued flex items-center justify-center flex-1">
              행사 소개가 존재하지 않습니다.
            </p>
          )}
        </div>

        <div className="mt-4">
          <p className="text-body2 text-text-default mb-1 font-semibold">
            오시는 길
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
