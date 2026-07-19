import LeftArrowIcon from '@/assets/icons/left-arrow-icon.svg?react'

import { Button } from '../ui/button'
import { useNavigate, useRouter, type LinkProps } from '@tanstack/react-router'

interface BackButtonProps {
  fallback?: LinkProps['to']
}

function BackButton({ fallback = '/' }: BackButtonProps) {
  const router = useRouter()
  const navigate = useNavigate()

  const handleClick = () => {
    if (fallback) {
      navigate({ to: fallback })
    }

    if (router.history.canGoBack()) {
      router.history.back()
    } else {
      navigate({ to: fallback })
    }
  }

  return (
    <Button variant={'icon'} size="icon" onClick={handleClick}>
      <LeftArrowIcon />
    </Button>
  )
}

export default BackButton
