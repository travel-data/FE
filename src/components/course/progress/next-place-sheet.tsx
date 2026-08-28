import PlaceTrafficLabel from '@/components/place/place-traffic-label'
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
interface NextPlaceSheetProps {
  isOpen: boolean
  onClose: () => void
}

function NextPlaceSheet({ isOpen, onClose }: NextPlaceSheetProps) {
  const { t } = useTranslation('course')
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-107.5 flex-col rounded-t-3xl bg-bg-main  text-text-default p-7">
        <DrawerHeader className=" gap-0 p-0 mb-2">
          <DrawerTitle className="!text-title3 text-text-heading text-left">
            {t('confirm.next_place')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="mt-auto flex flex-col ">
          <div className="flex items-center gap-1 mb-0.5">
            <h4 className="text-title3 ">동궁과 월지</h4>
            <PlaceTrafficLabel trafficLevel="moderate" />
          </div>

          <div className="">
            <p className="text-text-subdued flex items-center gap-0.5 mb-0.5">
              <CarIcon className="fill-text-subdued" />
              <span className="text-label">예상 소요 시간 · 도보 15분</span>
            </p>

            <p className="flex items-center gap-0.5 text-text-subdued text-label">
              <MarkerIcon className="size-3" />
              <span>
                경북 경주시 첨성로 169-5 (인왕동 839-1) · {''}
                <a
                  className="text-brand-primary font-bold"
                  target="_blank"
                  href={`http://m.map.kakao.com/scheme/look?p=${1},${1}`}
                >
                  {t('button.directions', { ns: 'course' })}
                </a>
              </span>
            </p>
          </div>

          <div className="bg-gray-300 h-44 rounded-xl my-4"></div>
        </div>

        <DrawerFooter className="p-0 flex-row items-center gap-4">
          <Button className="flex-1" variant={'soft'}>
            건너뛰기
          </Button>
          <Button className="flex-1">이동하기</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default NextPlaceSheet
