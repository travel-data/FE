import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { PlaceCategory } from '@/types/place'

interface PlaceMemoProps {
  courseId: string
  placeId: string
  category?: PlaceCategory
  memo?: {
    content: string
    images?: string[]
  }
  editScope?: 'note' | 'my-travel-notes'
}

function PlaceMemo({
  courseId,
  placeId,
  category = 'TOUR_SPOT',
  memo,
  editScope = 'note',
}: PlaceMemoProps) {
  const navigate = useNavigate()
  const { t } = useTranslation(['my', 'place'])

  const handleEdit = () => {
    if (editScope === 'my-travel-notes') {
      navigate({
        to: '/my/travel-notes/$courseId/place/$placeId/edit-memo',
        params: { courseId, placeId },
        search: { category },
      })
      return
    }

    navigate({
      to: '/note/$courseId/place/$placeId/edit-memo',
      params: { courseId, placeId },
      search: { from: undefined, category },
    })
  }

  return (
    <section className="px-5 py-3">
      <div className="flex items-center justify-between">
        <h2 className="text-body1 font-medium text-gray-800">
          {t('place:memo.title')}
        </h2>
        <button
          type="button"
          onClick={handleEdit}
          className="text-body2 text-primary-400"
        >
          {t('memo.edit_button')}
        </button>
      </div>

      <div className="mt-2">
        {!memo || !memo.content ? (
          <p className="text-label text-text-subdued">
            {t('memo.empty_title')}
            <br />
            {t('memo.empty_description')}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="whitespace-pre-wrap text-body2 text-gray-700">
              {memo.content}
            </p>
            {memo.images && memo.images.length > 0 && (
              <div className="flex flex-col gap-2">
                {memo.images.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`메모 이미지 ${index + 1}`}
                    className="max-h-[420px] w-full rounded-[8px] object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default PlaceMemo
