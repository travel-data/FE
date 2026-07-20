export const DURATION_OPTIONS = [
  { value: 'half_day', labelKey: 'form.duration_option_half_day' },
  { value: 'full_day', labelKey: 'form.duration_option_full_day' },
  { value: '1n2d', labelKey: 'form.duration_option_1n2d' },
  { value: '2n3d', labelKey: 'form.duration_option_2n3d' },
  { value: '3n4d', labelKey: 'form.duration_option_3n4d' },
] as const

export const COMPANION_TYPE_OPTIONS = [
  { value: 'alone', labelKey: 'form.companion_option_alone' },
  { value: 'couple', labelKey: 'form.companion_option_couple' },
  { value: 'friends', labelKey: 'form.companion_option_friends' },
  { value: 'family', labelKey: 'form.companion_option_family' },
] as const

export const PREFERRED_THEME_OPTIONS = [
  {
    value: 'history_culture',
    labelKey: 'form.preferred_theme_option_history_culture',
  },
  {
    value: 'nature_scenery',
    labelKey: 'form.preferred_theme_option_nature_scenery',
  },
  { value: 'food_tour', labelKey: 'form.preferred_theme_option_food_tour' },
] as const

export const TRANSPORTATION_OPTIONS = [
  {
    value: 'walk_transit',
    labelKey: 'form.transportation_option_walk_transit',
  },
  { value: 'bicycle', labelKey: 'form.transportation_option_bicycle' },
  { value: 'car', labelKey: 'form.transportation_option_car' },
] as const

export type DurationOption = (typeof DURATION_OPTIONS)[number]['value']
export type CompanionTypeOption =
  (typeof COMPANION_TYPE_OPTIONS)[number]['value']
export type PreferredThemeOption =
  (typeof PREFERRED_THEME_OPTIONS)[number]['value']
export type TransportationOption =
  (typeof TRANSPORTATION_OPTIONS)[number]['value']
