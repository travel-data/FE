export interface LatLng {
  lat: number
  lng: number
}

// 브라우저 현재 위치를 Promise로 반환
export const getCurrentPosition = () =>
  new Promise<LatLng>((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('geolocation unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })

// 두 좌표 사이 거리(m). 하버사인 공식
export const distanceMeters = (a: LatLng, b: LatLng) => {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
