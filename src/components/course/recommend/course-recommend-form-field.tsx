import type { ReactNode } from 'react'

interface CourseRecommendFormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
}

function CourseRecommendFormField({
  label,
  children,
  required = false,
}: CourseRecommendFormFieldProps) {
  return (
    <div>
      <div className="text-body2 font-bold mb-1.5 block">
        {label}
        {required && <span className="text-brand-secondary ml-0.5">*</span>}
      </div>
      {children}
    </div>
  )
}

export default CourseRecommendFormField
