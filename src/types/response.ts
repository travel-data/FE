export interface CommonResponse<T> {
  code: number
  message: string
  data: T
}

export type Paginated<K extends string, T> = {
  page: number
  size: number
  totalCount: number
} & { [P in K]: T[] }
