interface StoryCardProps {
  imageUrl?: string
  placeName: string
  subtitle: string
  onClick?: () => void
  storyTitle: string
}

function StoryCard({
  imageUrl,
  placeName,
  subtitle,
  onClick,
  storyTitle,
}: StoryCardProps) {
  const content = (
    <>
      <div className="h-25 w-20 shrink-0 overflow-hidden rounded-sm border border-border-1 bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={placeName}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-label  text-text-default">{placeName}</p>
        <h3 className="text-body1 font-bold text-text-heading">{storyTitle}</h3>
        <p className="text-body2 text-text-subdued">{subtitle}</p>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full gap-4  text-left items-start"
      >
        {content}
      </button>
    )
  }

  return <div className="flex gap-4  items-start">{content}</div>
}

export default StoryCard
