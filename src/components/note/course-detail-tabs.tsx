interface CourseDetailTabsProps {
  activeTab: 'timeline' | 'story'
  onTabChange: (tab: 'timeline' | 'story') => void
}

function CourseDetailTabs({ activeTab, onTabChange }: CourseDetailTabsProps) {
  return (
    <div className="flex gap-4 overflow-hidden p-5">
      <button
        type="button"
        onClick={() => onTabChange('timeline')}
        className={
          activeTab === 'timeline'
            ? 'shrink-0 text-title3 font-semibold text-text-heading'
            : 'shrink-0 text-title3 font-medium text-text-subdued'
        }
      >
        여행 타임라인
      </button>
      <button
        type="button"
        onClick={() => onTabChange('story')}
        className={
          activeTab === 'story'
            ? 'shrink-0 text-title3 font-semibold text-text-heading'
            : 'shrink-0 text-title3 font-medium text-text-subdued'
        }
      >
        저장한 스토리카드
      </button>
    </div>
  )
}

export default CourseDetailTabs
