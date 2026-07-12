// TODO : MOCK 데이터

function CourseItem() {
  return (
    <li className="flex items-center gap-2.5">
      <div className="size-20 bg-gray-200 rounded-lg" />
      <div className="flex flex-col">
        <p className="text-label font-bold">신라 야경 코스</p>
        <p className="text-caption text-text-subdued">
          첨성대 -{'>'} 동궁과 월지 -{'>'} 월정교
        </p>
        <div className="flex gap-1 mt-1">
          <CourseItemTag tag={'연인과 함께'} />
          <CourseItemTag tag={'산책'} />
        </div>
      </div>
    </li>
  )
}
export default CourseItem

function CourseItemTag({ tag }: { tag: string }) {
  return (
    <span className="bg-white text-[10px] font-bold rounded-full px-2">{`#${tag}`}</span>
  )
}
