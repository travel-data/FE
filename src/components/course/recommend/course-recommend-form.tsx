import { useTranslation } from 'react-i18next'
import { type SubmitEventHandler, useState } from 'react'
import CourseRecommendFormField from './course-recommend-form-field'
import {
  COMPANION_TYPE_OPTIONS,
  DURATION_OPTIONS,
  PREFERRED_THEME_OPTIONS,
  TRANSPORTATION_OPTIONS,
  type CompanionTypeOption,
  type DurationOption,
  type PreferredThemeOption,
  type TransportationOption,
} from './course-recommend-options'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import SearchAddressSheet from '@/components/bottom-sheet/search-address-sheet'
import type { CourseRecommendFormValues } from './use-course-recommend-form'

interface CourseRecommendFormProps {
  values: CourseRecommendFormValues
  setValue: <K extends keyof CourseRecommendFormValues>(
    key: K,
    value: CourseRecommendFormValues[K],
  ) => void
}

function CourseRecommendForm({ values, setValue }: CourseRecommendFormProps) {
  const [searchLocationSheet, setSearchLocationSheet] = useState(false)

  const { t } = useTranslation('course')

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <form
        id="course-recommend-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 overflow-scroll"
      >
        <CourseRecommendFormField label={t('form.departure_label')}>
          <div
            onClick={() => setSearchLocationSheet(true)}
            className={`border border-border-1 p-3 rounded-sm text-label ${
              values.departure ? 'text-text-default' : 'text-text-subdued'
            }`}
          >
            {values.departure
              ? values.departure.road_address_name
              : t('form.departure_placeholder')}
          </div>
        </CourseRecommendFormField>

        <CourseRecommendFormField label={t('form.duration_label')} required>
          <ToggleGroup
            type="single"
            spacing={2}
            value={values.duration ?? ''}
            onValueChange={(value) =>
              setValue('duration', (value || null) as DurationOption | null)
            }
          >
            {DURATION_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CourseRecommendFormField>

        <CourseRecommendFormField
          label={t('form.companion_type_label')}
          required
        >
          <ToggleGroup
            type="single"
            spacing={2}
            value={values.companionType ?? ''}
            onValueChange={(value) =>
              setValue(
                'companionType',
                (value || null) as CompanionTypeOption | null,
              )
            }
          >
            {COMPANION_TYPE_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CourseRecommendFormField>

        <CourseRecommendFormField label={t('form.preferred_theme_label')}>
          <ToggleGroup
            type="single"
            spacing={2}
            value={values.preferredTheme ?? ''}
            onValueChange={(value) =>
              setValue(
                'preferredTheme',
                (value || null) as PreferredThemeOption | null,
              )
            }
          >
            {PREFERRED_THEME_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CourseRecommendFormField>

        <CourseRecommendFormField
          label={t('form.transportation_label')}
          required
        >
          <ToggleGroup
            type="single"
            spacing={2}
            value={values.transportation ?? ''}
            onValueChange={(value) =>
              setValue(
                'transportation',
                (value || null) as TransportationOption | null,
              )
            }
          >
            {TRANSPORTATION_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CourseRecommendFormField>
      </form>

      {searchLocationSheet && (
        <SearchAddressSheet
          isOpen={searchLocationSheet}
          onClose={() => setSearchLocationSheet(false)}
          onSelect={(departure) => {
            setValue('departure', departure)
            setSearchLocationSheet(false)
          }}
        />
      )}
    </>
  )
}

export default CourseRecommendForm
