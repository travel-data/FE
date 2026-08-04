import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface PlaceDirectionsButtonProps {
  latitude: number
  longitude: number
  className?: string
}

function PlaceDirectionsButton({
  latitude,
  longitude,
  className,
}: PlaceDirectionsButtonProps) {
  const { t } = useTranslation('place')

  return (
    <Button asChild variant="soft" className={cn('flex-1', className)}>
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
