import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useGetCourseDetail } from '@/hooks/queries/course'
import {
  useAdvanceCourse,
  useUpdateCourseStatus,
} from '@/hooks/mutations/course'

export type ProgressSheet = 'next' | 'completion' | null

// 코스 진행 도메인 로직: 진행 아이템 파생, 이동/건너뛰기/완료, 자동완료 처리.
// 화면(렌더)·순수 UI 상태(메모 다이얼로그 등)는 컴포넌트에 남긴다.
export function useCourseProgress(courseId: string) {
  const navigate = useNavigate()
  const { data: detail, isPending, isFetching } = useGetCourseDetail(courseId)

  const [sheet, setSheet] = useState<ProgressSheet>(null)

  const items = detail?.items ?? []
  const current = items.find((item) => item.status === 'IN_PROGRESS') ?? null
  const pendingItems = items.filter((item) => item.status === 'PENDING')
  const nextPlace = pendingItems[0] ?? null
  const afterNext = pendingItems[1] ?? null

  const isLastOfCourse = !!current && !nextPlace
  const isLastOfDay =
    !!current && !!nextPlace && nextPlace.dayNumber > current.dayNumber
  const completionPlaces = isLastOfCourse
    ? items
    : items.filter((item) => item.dayNumber === current?.dayNumber)
  const canSkip = !!afterNext

  const advance = useAdvanceCourse()
  const { mutateAsync: updateStatus } = useUpdateCourseStatus()

  // COMPLETED 전환을 한 번만 트리거하기 위한 가드.
  // 명시적 완료 플로우(handleCompletionContinue)와 안전망 effect의 중복 호출 방지.
  const completionTriggeredRef = useRef(false)

  useEffect(() => {
    if (completionTriggeredRef.current) return
    if (!detail || detail.status !== 'IN_PROGRESS') return
    const allCompleted =
      detail.items.length > 0 &&
      detail.items.every((item) => item.status === 'COMPLETED')
    if (allCompleted) {
      completionTriggeredRef.current = true
      updateStatus({ courseId, status: 'COMPLETED' }).catch(() => {
        completionTriggeredRef.current = false // 실패 시 재시도 허용
      })
    }
  }, [detail, courseId, updateStatus])

  const handleMove = () => {
    if (!current || !nextPlace) return
    advance.mutate(
      { courseId, complete: [current.itemId], start: nextPlace.itemId },
      { onSuccess: () => setSheet(null) },
    )
  }

  const handleSkip = () => {
    if (!current || !nextPlace || !afterNext) return
    advance.mutate({
      courseId,
      complete: [current.itemId, nextPlace.itemId],
      start: afterNext.itemId,
    })
    setSheet(null)
  }

  const handleCompletionContinue = () => {
    if (!current) return
    if (isLastOfCourse) {
      completionTriggeredRef.current = true // 안전망 effect 중복 호출 방지
      Promise.all([
        advance.mutateAsync({
          courseId,
          complete: [current.itemId],
          start: null,
        }),
        updateStatus({ courseId, status: 'COMPLETED' }),
      ])
        .then(() => navigate({ to: '/', replace: true }))
        .catch(() => {
          completionTriggeredRef.current = false // 실패 시 재시도 허용
        })
    } else {
      advance.mutate(
        { courseId, complete: [current.itemId], start: nextPlace!.itemId },
        { onSuccess: () => setSheet(null) },
      )
    }
  }

  return {
    detail,
    isPending,
    isFetching,
    current,
    nextPlace,
    isLastOfCourse,
    isLastOfDay,
    completionPlaces,
    canSkip,
    advancePending: advance.isPending,
    sheet,
    setSheet,
    handleMove,
    handleSkip,
    handleCompletionContinue,
  }
}
