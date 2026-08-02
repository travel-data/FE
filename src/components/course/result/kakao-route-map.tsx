import IndexMarker from '@/components/map/index-marker'
import { MapConfig } from '@/constants/map-config'
import { Map, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'

export interface RouteMapPlace {
  id: number
  lat: number
  lng: number
}

interface KakaoRouteMapProps {
  places: RouteMapPlace[]
}

declare global {
  interface Window {
    kakao: any
  }
}

function Fallback({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-caption text-text-subdued">
      {message}
    </div>
  )
}

function KakaoRouteMap({ places }: KakaoRouteMapProps) {
  const appKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined

  const [loading, error] = useKakaoLoader({ appkey: appKey ?? '' })

  if (error) {
    console.error('[KakaoRouteMap] 로드 에러:', error)
  }

  if (!appKey || error) {
    return (
      <Fallback
        message={
          !appKey
            ? 'VITE_KAKAO_JS_KEY 환경변수가 없습니다'
            : `지도 로드 실패: ${error?.message ?? '알 수 없는 오류'}`
        }
      />
    )
  }

  if (loading) return <Fallback message="지도를 불러오는 중..." />

  const center = { lat: places[0].lat, lng: places[0].lng }

  const handleMapCreate = (map: kakao.maps.Map) => {
    const bounds = new window.kakao.maps.LatLngBounds()
    const path = places.map((p) => {
      const latLng = new window.kakao.maps.LatLng(p.lat, p.lng)
      bounds.extend(latLng)
      return latLng
    })

    new window.kakao.maps.Polyline({
      map,
      path,
      ...MapConfig.polylineStyle,
    })

    // react-kakao-maps-sdk의 center effect가 먼저 실행된 뒤 setBounds가 적용되도록 지연
    setTimeout(() => map.setBounds(bounds), 0)
  }

  return (
    <Map
      center={center}
      style={{ width: '100%', height: '100%' }}
      level={5}
      onCreate={handleMapCreate}
    >
      {places.map((place, index) => (
        <CustomOverlayMap
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          yAnchor={0.5}
          xAnchor={0.5}
        >
          <IndexMarker index={index + 1} />
        </CustomOverlayMap>
      ))}
    </Map>
  )
}

export default KakaoRouteMap
