import {
  CourseDetail,
  CourseItemPayload,
  PlaceItem,
  TransportationType,
  toPlaceItem,
} from '@/types/course'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface CourseFormDays {
  places: PlaceItem[]
  segments: TransportationType[]
}

interface CourseFormStoreState {
  title: string
  selectedDayIndex: number
  days: CourseFormDays[]
  initialSnapshot: string | null
  actions: {
    setTitle: (title: string) => void

    setSelectedDayIndex: (dayIndex: number) => void
    addDays: () => void
    removeDays: () => void

    addPlace: (place: PlaceItem) => void
    removePlace: (placeIndex: number) => void
    setDayPlaces: (places: PlaceItem[]) => void

    setSegment: ({
      segmentIndex,
      type,
    }: {
      segmentIndex: number
      type: TransportationType
    }) => void

    initFormDetail: (detail: CourseDetail) => void
    reset: () => void
    toPayload: () => CourseItemPayload[]
  }
}

export const courseFormStore = create<CourseFormStoreState>()(
  persist(
    (set, get) => ({
      title: '',
      selectedDayIndex: 0,
      days: [],
      initialSnapshot: null,
      actions: {
        setTitle: (title) => set({ title }),

        setSelectedDayIndex: (dayIndex) => set({ selectedDayIndex: dayIndex }),

        addDays: () =>
          set((state) => ({
            days: [...state.days, { places: [], segments: [] }],
            selectedDayIndex: state.days.length,
          })),

        removeDays: () =>
          set((state) => {
            const newDays = state.days.slice(0, -1)
            return {
              days: newDays,
              selectedDayIndex: Math.min(
                state.selectedDayIndex,
                newDays.length - 1,
              ),
            }
          }),

        addPlace: (place) =>
          set((state) => {
            const i = state.selectedDayIndex
            const key = (p: PlaceItem) => p.spotId ?? p.nearbyPlaceId
            if (state.days[i].places.some((p) => key(p) === key(place)))
              return state
            return {
              days: state.days.map((d, idx) =>
                idx !== i
                  ? d
                  : {
                      ...d,
                      places: [...d.places, place],
                      segments:
                        d.places.length > 0
                          ? [...d.segments, 'WALK']
                          : d.segments,
                    },
              ),
            }
          }),

        removePlace: (placeIndex) =>
          set((state) => {
            const i = state.selectedDayIndex
            const segIndex = placeIndex === 0 ? 0 : placeIndex - 1
            return {
              days: state.days.map((d, idx) =>
                idx !== i
                  ? d
                  : {
                      ...d,
                      places: d.places.filter((_, pi) => pi !== placeIndex),
                      segments: d.segments.filter((_, si) => si !== segIndex),
                    },
              ),
            }
          }),

        setDayPlaces: (places) =>
          set((state) => ({
            days: state.days.map((d, idx) =>
              idx !== state.selectedDayIndex ? d : { ...d, places },
            ),
          })),

        setSegment: ({ segmentIndex, type }) =>
          set((state) => {
            const dayIndex = state.selectedDayIndex
            return {
              days: state.days.map((d, idx) =>
                idx !== dayIndex
                  ? d
                  : {
                      ...d,
                      segments: d.segments.map((seg, si) =>
                        si === segmentIndex ? type : seg,
                      ),
                    },
              ),
            }
          }),

        initFormDetail: (detail) => {
          const sorted = [...detail.items].sort(
            (a, b) => a.dayNumber - b.dayNumber || a.itemOrder - b.itemOrder,
          )
          const dayMap = sorted.reduce<Map<number, CourseFormDays>>(
            (acc, item) => {
              if (!acc.has(item.dayNumber))
                acc.set(item.dayNumber, { places: [], segments: [] })
              const day = acc.get(item.dayNumber)!
              if (day.places.length > 0)
                day.segments.push(item.transportType ?? 'WALK')
              const place = toPlaceItem(item)
              day.places.push(place)
              return acc
            },
            new Map(),
          )
          set({
            title: detail.title,
            days: Array.from(dayMap.values()),
            selectedDayIndex: 0,
          })
          set({ initialSnapshot: JSON.stringify(get().actions.toPayload()) })
        },

        reset: () =>
          set({
            selectedDayIndex: 0,
            days: [],
            title: '',
            initialSnapshot: null,
          }),

        toPayload: () => {
          const { days } = get()
          return days
            .filter((day) => day.places.length > 0)
            .flatMap((day, di) =>
              day.places.map((place, idx) => ({
                itemId: place.itemId ?? null,
                category: place.category,
                spotId: place.spotId,
                nearbyPlaceId: place.nearbyPlaceId,
                itemOrder: idx + 1,
                transportType: idx > 0 ? day.segments[idx - 1] : null,
                dayNumber: di + 1,
              })),
            )
        },
      },
    }),
    {
      name: 'course-form',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ title, selectedDayIndex, days, initialSnapshot }) => ({
        title,
        selectedDayIndex,
        days,
        initialSnapshot,
      }),
    },
  ),
)

export const useCourseFormStore = () => {
  return courseFormStore()
}

export const useCourseFormDays = () => {
  return courseFormStore((state) => state.days)
}

export const useCourseFormSelectedDayIndex = () => {
  return courseFormStore((state) => state.selectedDayIndex)
}

export const useCourseFormActions = () => {
  return courseFormStore((state) => state.actions)
}
