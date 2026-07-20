interface PlaceInfoProps {
  category: string
  placeName: string
  address: string
  description: string
  hasStoryCard?: boolean
}

function PlaceInfo({
  category,
  placeName,
  address,
  description,
  hasStoryCard,
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

        {hasStoryCard && (
          <div className="h-25 w-[77px] shrink-0 rounded-[8px] bg-gray-100" />
        )}
      </div>

      <p className="mt-6 text-label text-text-default">{description}</p>
    </section>
  )
}

export default PlaceInfo
