import { PlaceTrafficLevel } from '@/types/place'
import { useTranslation } from 'react-i18next'

interface PlaceTrafficLabelProps {
  trafficLevel: PlaceTrafficLevel
}

function PlaceTrafficLabel({ trafficLevel }: PlaceTrafficLabelProps) {
  const { t } = useTranslation('course')

  return (
    <span className="px-3 py-0.5 rounded-full inline-flex items-center justify-center text-caption text-primary-50 bg-brand-primary">
      {t(`traffic_level.${trafficLevel}`)}
    </span>
  )
}

export default PlaceTrafficLabel
