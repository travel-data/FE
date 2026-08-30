import { Button } from '../ui/button'

import EmptyBookmarkIcon from '@/assets/icons/empty-bookmark-icon.svg?react'
import FillBookmarkIcon from '@/assets/icons/fill-bookmark-icon.svg?react'

interface PlaceBookmarkButtonProps {
  isBookmarked: boolean
}

function PlaceBookmarkButton({ isBookmarked }: PlaceBookmarkButtonProps) {
  return (
    <Button size="icon" variant={'icon'} className="size-10">
      {isBookmarked ? (
        <FillBookmarkIcon className="fill-brand-primary" />
      ) : (
        <EmptyBookmarkIcon />
      )}
    </Button>
  )
}

export default PlaceBookmarkButton
