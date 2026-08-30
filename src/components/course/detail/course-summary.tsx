interface CourseSummaryProps {
  name: string
  description: string | null
  courseTypeLabel: string
}

function CourseSummary({
  name,
  description,
  courseTypeLabel,
}: CourseSummaryProps) {
  return (
    <div className="px-5 flex flex-col gap-1.5">
      <div>
        <p className="text-label font-semibold text-brand-primary">
          {courseTypeLabel}
        </p>
        <h2 className="text-text-heading text-title2">{name}</h2>
      </div>
      {description && (
        <p className="text-label text-text-subdued whitespace-pre-line">
          {description}
        </p>
      )}
    </div>
  )
}

export default CourseSummary
