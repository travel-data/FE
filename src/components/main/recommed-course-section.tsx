import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import CourseItem from '../course/course-item'

// TODO: MOCK 데이터 교체
function RecommedCourseSection() {
  const { t } = useTranslation('home')

  return (
    <section className="py-4 px-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h4 className="text-body2 font-bold ">
            {t('recommend_course_section.title')}
          </h4>
          <p className="text-text-subdued text-caption">
            {t('recommend_course_section.description')}
          </p>
        </div>

        <Link to="/" className="text-text-subdued text-caption">
          {t('button.see_all', { ns: 'common' })}
        </Link>
      </div>

      <ul className="flex flex-col gap-2.5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <li key={idx}>
            <CourseItem />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecommedCourseSection
