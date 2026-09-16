import { useTranslation } from 'react-i18next'

interface CourseDetailTabsProps {
  activeTab: 'timeline' | 'story'
  onTabChange: (tab: 'timeline' | 'story') => void
}

function CourseDetailTabs({ activeTab, onTabChange }: CourseDetailTabsProps) {
  const { t } = useTranslation('my')

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
        {t('travel_note.timeline')}
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
        {t('travel_note.tab_story')}
      </button>
    </div>
  )
}

export default CourseDetailTabs
