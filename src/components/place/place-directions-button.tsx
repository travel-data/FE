import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'

interface PlaceDirectionsButtonProps {
  latitude: number
  longitude: number
}

function PlaceDirectionsButton({
  latitude,
  longitude,
}: PlaceDirectionsButtonProps) {
  const { t } = useTranslation('place')

  return (
    <Button asChild variant="soft" className="flex-1">
      <a
        href={`http://m.map.kakao.com/scheme/look?p=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('button.directions_link')}
      </a>
    </Button>
  )
}

export default PlaceDirectionsButton
