import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer'
import { useTranslation } from 'react-i18next'
import transportationIcon from '@/lib/transportation-icon'
import { TransportationType } from '@/types/course'

interface EditCourseTransportationSheetProps {
  isOpen: boolean
  onClose: () => void
  defaultValue?: TransportationType
  onConfirm: (value: TransportationType) => void
}

const TRANSPORT_OPTIONS = [
  { value: 'WALK', iconKey: 'WALK' as const },
  { value: 'BIKE', iconKey: 'BIKE' as const },
  { value: 'CAR', iconKey: 'CAR' as const },
] satisfies { value: string; iconKey: keyof typeof transportationIcon }[]

function EditCourseTransportationSheet({
  isOpen,
  onClose,
  defaultValue,
  onConfirm,
}: EditCourseTransportationSheetProps) {
  const { t } = useTranslation('course')
  const [selected, setSelected] = useState<TransportationType | undefined>(
    defaultValue,
  )

  const TRANSPORT_LABELS: Record<
    (typeof TRANSPORT_OPTIONS)[number]['value'],
    string
  > = {
    WALK: `${t('transportation.WALK')} 및 ${t('transportation.public_transportation')}`,
    BIKE: t('transportation.BIKE'),
    CAR: t('transportation.CAR'),
  }

  const isConfirmDisabled = !selected || selected === defaultValue

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="gap-0 p-7 pb-4 text-left">
          <h2 className="text-title3 font-bold">
            {t('edit.confirm_transportation_title')}
          </h2>
          <p className="text-body2 text-text-subdued">
            {t('edit.confirm_transportation_description')}
          </p>
        </DrawerHeader>

        <div className="flex flex-col gap-3 px-7">
          {TRANSPORT_OPTIONS.map(({ value, iconKey }) => {
            const Icon = transportationIcon[iconKey]
            const isSelected = selected === value

            return (
              <button
                key={value}
                onClick={() => setSelected(value as TransportationType)}
                className={`flex w-full items-center gap-3 rounded-md border px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? 'border-brand-primary bg-primary-50 text-brand-primary'
                    : 'border-gray-200 bg-white text-text-subdued'
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 ${isSelected ? 'fill-brand-primary' : 'fill-gray-400'}`}
                />
                <span className="text-body1">{TRANSPORT_LABELS[value]}</span>
              </button>
            )
          })}
        </div>

        <DrawerFooter className="flex flex-row items-center gap-2.5">
          <Button onClick={onClose} variant="soft" className="flex-1">
            {t('button.close', { ns: 'common' })}
          </Button>
          <Button
            onClick={() => selected && onConfirm(selected)}
            variant="solid"
            className="flex-1"
            disabled={isConfirmDisabled}
          >
            {t('edit.confirm_edit_transportation_button')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default EditCourseTransportationSheet
