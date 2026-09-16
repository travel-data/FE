interface PlaceInfoProps {
  category: string
  placeName: string
  address: string
  description: string
  hasStoryCard?: boolean
  storyCardImageUrl?: string | null
  onStoryCardClick?: () => void
}

function PlaceInfo({
  category,
  placeName,
  address,
  description,
  hasStoryCard,
  storyCardImageUrl,
  onStoryCardClick,
}: PlaceInfoProps) {
  return (
    <section className="px-5 py-3">
      <div className="flex items-start justify-between gap-5">
        <div className="flex flex-1 flex-col">
          <span className="w-fit rounded-[40px] bg-brand-primary px-3 py-1 text-caption text-primary-50">
            {category}
          </span>
          <h1 className="mt-1 text-display2 font-bold text-text-heading">
            {placeName}
          </h1>
          <p className="text-caption text-text-subdued">{address}</p>
        </div>

        {hasStoryCard &&
          (onStoryCardClick ? (
            <button
              type="button"
              aria-label={`${placeName} 스토리카드 보기`}
              onClick={onStoryCardClick}
              className="h-25 w-[77px] shrink-0 overflow-hidden rounded-[8px] bg-gray-100"
            >
              {storyCardImageUrl ? (
                <img
                  src={storyCardImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
            </button>
          ) : (
            <div className="h-25 w-[77px] shrink-0 overflow-hidden rounded-[8px] bg-gray-100">
              {storyCardImageUrl ? (
                <img
                  src={storyCardImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          ))}
      </div>

      <p className="mt-6 text-label text-text-default">{description}</p>
    </section>
  )
}

export default PlaceInfo
