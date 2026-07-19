import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import TargetIcon from '@/assets/icons/target-icon.svg?react'
import { useEffect, useState } from 'react'
import useSearchAddressQuery from '@/hooks/queries/use-search-address-query'
import { getGeocordAddress } from '@/services/kakao/local'
import type { CourseDeparture } from '@/components/course/recommend/use-course-recommend-form'
import { useInView } from 'react-intersection-observer'
interface SearchAddressSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (departure: CourseDeparture) => void
}

function SearchAddressSheet({
  isOpen,
  onClose,
  onSelect,
}: SearchAddressSheetProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const { ref, inView } = useInView()

  const { data, isPending, hasNextPage, fetchNextPage } =
    useSearchAddressQuery(searchTerm)

  const { t } = useTranslation('course')

  const searchResult = data?.pages
    .flatMap((page) => page.documents)
    .filter((document) => document.address_name.includes('경주'))

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-x-0 bottom-0 px-7 py-5 z-50 mx-auto flex w-full max-w-107.5 flex-col rounded-t-3xl bg-bg-main text-text-default">
        <DrawerHeader className="text-left p-0 gap-0 mb-4 pt-2">
          <DrawerTitle className="!text-title3 text-text-heading">
            {t('form.address_search_title')}
          </DrawerTitle>
          <DrawerDescription className="text-label text-text-subdued">
            {t('form.address_search_description')}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-100">
          <div className="relative">
            <MarkerIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              className="border w-full h-12 border-border-1 rounded-md pl-10.5 text-label outline-0"
              placeholder={t('form.address_search_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
            {!searchTerm && <CurrentLocationButton onLocate={setSearchTerm} />}
          </div>

          <div className="py-4">
            <p className="text-label text-text-subdued mb-2">
              {t('form.address_search_result')}
            </p>
            {!isPending && searchResult && (
              <ul className="flex flex-col max-h-80 overflow-scroll">
                {searchResult.map((result) => (
                  <li
                    key={result.id}
                    onClick={() =>
                      onSelect({
                        x: result.x,
                        y: result.y,
                        road_address_name: result.road_address_name,
                      })
                    }
                    className="py-3 flex flex-col border-b border-border-1 last:border-none text-label cursor-pointer"
                  >
                    <span>{highlightText(result.place_name, searchTerm)}</span>
                    <span className="text-text-subdued">
                      {result.address_name}
                    </span>
                  </li>
                ))}
                {hasNextPage && <li ref={ref} className="min-h-4 w-full" />}
              </ul>
            )}
          </div>
        </div>

        <Button onClick={onClose}>{t('form.address_search_close')}</Button>
      </DrawerContent>
    </Drawer>
  )
}

export default SearchAddressSheet

function CurrentLocationButton({
  onLocate,
}: {
  onLocate: (addressName: string) => void
}) {
  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords

      const { documents } = await getGeocordAddress({
        longitude: String(longitude),
        latitude: String(latitude),
      })

      const document = documents[0]

      if (!document) return

      onLocate(
        document.road_address?.address_name ?? document.address.address_name,
      )
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      <TargetIcon />
    </button>
  )
}

function highlightText(text: string, searchTerm: string) {
  const index = text.indexOf(searchTerm)

  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <span className="text-brand-primary">
        {text.slice(index, index + searchTerm.length)}
      </span>
      {text.slice(index + searchTerm.length)}
    </>
  )
}
