import { useTranslation } from 'react-i18next'

interface CourseSummaryProps {
  name: string
  tags: string[]
  totalTime: string
  description: string
  courseTypeLabel: string
}

function CourseSummary({
  name,
  totalTime,
  description,
  courseTypeLabel,
}: CourseSummaryProps) {
  const { t } = useTranslation('course')

  return (
    <div className="px-5 flex flex-col gap-1.5">
      <div>
        <p className="text-label font-semibold text-brand-primary">
          {courseTypeLabel}
        </p>
        <h2 className="text-text-heading text-title2">{name}</h2>
        <p className="text-label text-brand-primary">
          {t('label.estimated')} {totalTime}
        </p>
      </div>
      <p className="text-label text-text-subdued whitespace-pre-line">
        {description}
      </p>
    </div>
  )
}

export default CourseSummary
