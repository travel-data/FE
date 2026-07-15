import auth from '../locales/ko/auth.json'
import common from '../locales/ko/common.json'
import course from '../locales/ko/course.json'
import home from '../locales/ko/home.json'
import my from '../locales/ko/my.json'
import place from '../locales/ko/place.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      auth: typeof auth
      common: typeof common
      course: typeof course
      home: typeof home
      my: typeof my
      place: typeof place
    }
  }
}
