import { Button } from '../ui/button'

import EmptyBookmarkIcon from '@/assets/icons/empty-bookmark-icon.svg?react'
import FillBookmarkIcon from '@/assets/icons/fill-bookmark-icon.svg?react'
import { useTogglePlaceSave } from '@/hooks/mutations/place'
import type { PlaceCategory } from '@/types/place'

interface PlaceBookmarkButtonProps {
  placeId: number
  category: PlaceCategory
  isBookmarked: boolean
}

function PlaceBookmarkButton({
  placeId,
  category,
  isBookmarked,
}: PlaceBookmarkButtonProps) {
  const { mutate, isPending, variables } = useTogglePlaceSave()

  // 요청 중엔 보낸 값(낙관적)을, 그 외엔 prop(서버 확정값)을 그대로 사용.
  // prop이 단일 소스 → 상세 로드 후 like가 바뀌어도 즉시 반영, 실패 시 자동 복귀.
  const saved = isPending && variables ? variables.save : isBookmarked

  const handleClick = () => mutate({ placeId, category, save: !saved })

  return (
    <Button
      size="icon"
      variant={'icon'}
      className="size-10 disabled:opacity-100"
      onClick={handleClick}
      disabled={isPending}
    >
      {saved ? (
        <FillBookmarkIcon className="fill-brand-primary" />
      ) : (
        <EmptyBookmarkIcon />
      )}
    </Button>
  )
}

export default PlaceBookmarkButton
