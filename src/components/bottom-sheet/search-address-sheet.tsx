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
import { useEffect, useState } from 'react'
import type { CourseDeparture } from '@/components/course/recommend/use-course-recommend-form'
import { useInView } from 'react-intersection-observer'
import { useTourSpotsInfiniteQuery } from '@/hooks/queries/place'
import { getPlaceId } from '@/types/place'

const PRESET_DEPARTURES = [
  {
    placeId: 'GYEONGJU_STATION',
    nameKey: 'form.departure_gyeongju_station',
    addressKey: 'form.departure_gyeongju_station_address',
  },
  {
    placeId: 'GYEONGJU_INTERCITY_BUS_TERMINAL',
    nameKey: 'form.departure_intercity_terminal',
    addressKey: 'form.departure_intercity_terminal_address',
  },
  {
    placeId: 'GYEONGJU_EXPRESS_BUS_TERMINAL',
    nameKey: 'form.departure_express_terminal',
    addressKey: 'form.departure_express_terminal_address',
  },
] as const
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
    useTourSpotsInfiniteQuery({ keyword: searchTerm || undefined })

  const { t } = useTranslation('course')

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()
  const presetResults = PRESET_DEPARTURES.filter(({ nameKey, addressKey }) => {
    if (!normalizedSearchTerm) return true
    return `${t(nameKey)} ${t(addressKey)}`
      .toLocaleLowerCase()
      .includes(normalizedSearchTerm)
  })
  const searchResult =
    data?.pages
      .flatMap((page) => page.places)
      .filter((place) => place.category !== 'RESTAURANT') ?? []

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
          </div>

          <div className="py-4">
            <p className="text-label text-text-subdued mb-2">
              {t('form.address_search_result')}
            </p>
            {!isPending && (
              <ul className="flex flex-col max-h-80 overflow-scroll">
                {presetResults.map((preset) => (
                  <li
                    key={preset.placeId}
                    onClick={() =>
                      onSelect({
                        category: 'PRESET',
                        placeId: preset.placeId,
                        name: t(preset.nameKey),
                        address: t(preset.addressKey),
                      })
                    }
                    className="py-3 flex flex-col border-b border-border-1 text-label cursor-pointer"
                  >
                    <span>{highlightText(t(preset.nameKey), searchTerm)}</span>
                    <span className="text-text-subdued">
                      {t(preset.addressKey)}
                    </span>
                  </li>
                ))}
                {searchResult.map((result) => (
                  <li
                    key={`${result.category}-${getPlaceId(result)}`}
                    onClick={() =>
                      onSelect({
                        category: result.category,
                        placeId: String(getPlaceId(result)),
                        name: result.name,
                        address: result.address,
                      })
                    }
                    className="py-3 flex flex-col border-b border-border-1 last:border-none text-label cursor-pointer"
                  >
                    <span>{highlightText(result.name, searchTerm)}</span>
                    <span className="text-text-subdued">{result.address}</span>
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
