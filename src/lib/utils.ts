import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display1',
        'text-display2',
        'text-heading1',
        'text-title1',
        'text-title2',
        'text-title3',
        'text-body1',
        'text-body2',
        'text-label',
        'text-caption',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
