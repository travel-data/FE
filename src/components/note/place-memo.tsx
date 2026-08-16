import { useNavigate } from '@tanstack/react-router'

interface PlaceMemoProps {
  courseId: string
  placeId: string
  memo?: {
    content: string
    images?: string[]
  }
}

function PlaceMemo({ courseId, placeId, memo }: PlaceMemoProps) {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate({
      to: '/note/$courseId/place/$placeId/edit-memo',
      params: { courseId, placeId },
      search: { from: undefined },
    })
  }

  return (
    <section className="px-5 py-3">
      <div className="flex items-center justify-between">
        <h2 className="text-body1 font-medium text-gray-800">메모</h2>
        <button
          type="button"
          onClick={handleEdit}
          className="text-body2 text-primary-400"
        >
          수정
        </button>
      </div>

      <div className="mt-2">
        {!memo || !memo.content ? (
          <p className="text-label text-text-subdued">
            작성된 메모가 없어요
            <br />
            해당 장소에서 느낀 점을 작성하고 이미지를 추가해보세요
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="whitespace-pre-wrap text-body2 text-gray-700">
              {memo.content}
            </p>
            {memo.images && memo.images.length > 0 && (
              <div className="flex flex-col gap-2">
                {memo.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="h-[200px] w-full rounded-[8px] border border-dashed border-gray-300 bg-white"
                    aria-label={`메모 이미지 영역 ${index + 1}`}
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
