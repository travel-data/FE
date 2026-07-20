interface StoryCardProps {
  imageUrl?: string
  placeName: string
  subtitle: string
}

function StoryCard({ imageUrl, placeName, subtitle }: StoryCardProps) {
  return (
    <div className="flex gap-6 px-2 py-4">
      <div className="h-25 w-[77px] shrink-0 overflow-hidden rounded-[8px] bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={placeName}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-title2 font-bold text-text-heading">
          {placeName}
        </h3>
        <p className="text-body1 text-text-default">{subtitle}</p>
      </div>
    </div>
  )
}

export default StoryCard
