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
  travelStartDate: string
  duration: DurationOption | null
  companionType: CompanionTypeOption | null
  preferredTheme: PreferredThemeOption | null
  transportation: TransportationOption | null
}

function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const INITIAL_VALUES: CourseRecommendFormValues = {
  departure: null,
  travelStartDate: getTodayString(),
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
    !!values.travelStartDate &&
    !!values.duration &&
    !!values.companionType &&
    !!values.transportation

  return { values, setValue, isValid }
}

export default useCourseRecommendForm
