import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '../ui/drawer'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import PlaceBookmarkButton from './place-bookmark-button'
import { Button } from '../ui/button'

import DownloadIcon from '@/assets/icons/download-icon.svg?react'
import PlaceDirectionsButton from './place-directions-button'
import { useTranslation } from 'react-i18next'

export interface PlaceDetail {
  id: number
  name: string
  category: 'attraction' | 'cafe' | 'restaurant' | 'convenience'
  address: string
  imageUrl: string
  description: string
}

export const MOCK_PLACE_DETAIL: PlaceDetail = {
  id: 1,
  name: '첨성대',
  category: 'attraction',
  address: '경북 경주시 첨성로 169-5',
  imageUrl: 'https://placehold.co/600x400',
  description:
    '경주 첨성대는 신라 선덕여왕(재위 632~647년) 때 세워진 아시아에서 가장 오래된 석조 천문 관측 시설(국보 제31호)입니다. 별을 관측하거나 절기를 측정하기 위해 세워진 것으로 추정되며, 신라인들의 뛰어난 과학적, 천문학적 지식을 고스란히 담고 있습니다.',
}

interface PlaceDetailSheetProps {
  isOpen: boolean
  onClose: () => void
  placeId: number
  actionButton?: React.ReactNode
}

function PlaceDetailSheet({
  isOpen,
  onClose,
  placeId,
  actionButton,
}: PlaceDetailSheetProps) {
  // TODO: useQuery로 placeId 기반 상세 정보 호출
  void placeId

  const { t } = useTranslation('common')

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-7 gap-4">
        <DrawerHeader className="flex justify-between items-center p-0">
          <div className="flex flex-col gap-0.5 items-start">
            <h2 className="text-title3 text-text-default">
              {MOCK_PLACE_DETAIL.name}
            </h2>
            <p className="flex items-center gap-0.5">
              <MarkerIcon className="size-2.5" />
              <span className="text-caption text-text-subdued">
                {MOCK_PLACE_DETAIL.address}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={'icon'} size="icon">
              <DownloadIcon />
            </Button>
            <PlaceBookmarkButton isBookmarked={true} />
          </div>
        </DrawerHeader>

        <div className="space-y-3.5 mb">
          <img
            className="h-56.75 w-full rounded-md object-cover"
            src={MOCK_PLACE_DETAIL.imageUrl}
            alt={MOCK_PLACE_DETAIL.name}
          />
          <p className="text-label text-text-subdued">
            {MOCK_PLACE_DETAIL.description}
          </p>
        </div>

        <DrawerFooter className="p-0 flex-row items-center gap-4">
          <PlaceDirectionsButton latitude={35.79} longitude={129.3319} />
          {actionButton ?? (
            <Button onClick={onClose} variant="solid" className="flex-1">
              {t('button.close')}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PlaceDetailSheet
