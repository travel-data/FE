import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import PlaceInfo from '@/components/note/place-info'
import PlaceMemo from '@/components/note/place-memo'

export const Route = createFileRoute(
  '/(authentication)/note/$courseId_/place/$placeId',
)({
  component: RouteComponent,
})

const MOCK_PLACE_INFO = {
  category: '관광지',
  placeName: '첨성대',
  address: '경상북도 경주시 인왕동 839-1',
  description:
    '신라시대 천문 관측대로, 동양에서 가장 오래된 천문대입니다. 높이 9.17m의 원통형 석조 건축물로 국보 제31호로 지정되어 있습니다.',
  hasStoryCard: true,
}

const MOCK_PLACE_DATA = {
  withMemo: {
    content:
      '신라시대의 천문 관측대로 정말 인상적이었습니다.\n돌을 쌓아 만든 구조가 신기했어요.',
    images: [],
  },
  withMemoAndImages: {
    content: '야경이 정말 아름다웠습니다!\n사진으로 담기 어려울 정도로 멋졌어요.',
    images: ['image1', 'image2'],
  },
  empty: undefined,
}

function RouteComponent() {
  const navigate = useNavigate()
  const { courseId, placeId } = Route.useParams()

  const handleBack = () => {
    navigate({ to: '/note/$courseId', params: { courseId } })
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="flex items-center px-5 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex size-11 items-center justify-center rounded-full bg-white"
        >
          <ChevronLeft className="size-[18px]" />
        </button>
      </header>

      <main className="flex-1">
        <PlaceInfo
          category={MOCK_PLACE_INFO.category}
          placeName={MOCK_PLACE_INFO.placeName}
          address={MOCK_PLACE_INFO.address}
          description={MOCK_PLACE_INFO.description}
          hasStoryCard={MOCK_PLACE_INFO.hasStoryCard}
        />

        <div className="h-8" />

        <PlaceMemo
          courseId={courseId}
          placeId={placeId}
          memo={MOCK_PLACE_DATA.withMemoAndImages}
        />
      </main>
    </div>
  )
}
