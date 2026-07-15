/* eslint-disable react-refresh/only-export-components */
import { ComponentPropsWithoutRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid:
          'bg-brand-primary text-white hover:bg-hover disabled:bg-disabled',
        soft: 'bg-primary-50 text-brand-primary hover:bg-primary-100 disabled:bg-disabled',
        outline:
          'border bg-primary-50 border-brand-primary text-brand-primary hover:border-hover hover:text-hover disabled:border-disabled disabled:text-disabled',
        icon: 'bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full',
      },
      size: {
        default: 'h-15 px-4 ',
        sm: 'h-12 gap-1.5 px-3 ',
        icon: 'size-11 p-3',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends
    ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
