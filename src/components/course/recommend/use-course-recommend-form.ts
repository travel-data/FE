import { useState } from 'react'
import type {
  CompanionTypeOption,
  DurationOption,
  PreferredThemeOption,
  TransportationOption,
} from './course-recommend-options'

export interface CourseDeparture {
  x: string
  y: string
  road_address_name: string
}

export interface CourseRecommendFormValues {
  departure: CourseDeparture | null
  duration: DurationOption | null
  companionType: CompanionTypeOption | null
  preferredTheme: PreferredThemeOption | null
  transportation: TransportationOption | null
}

const INITIAL_VALUES: CourseRecommendFormValues = {
  departure: null,
  duration: null,
  companionType: null,
  preferredTheme: null,
  transportation: null,
}

function useCourseRecommendForm() {
  const [values, setValues] =
    useState<CourseRecommendFormValues>(INITIAL_VALUES)

  const setValue = <K extends keyof CourseRecommendFormValues>(
    key: K,
    value: CourseRecommendFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const isValid =
    !!values.duration && !!values.companionType && !!values.transportation

  return { values, setValue, isValid }
}

export default useCourseRecommendForm
