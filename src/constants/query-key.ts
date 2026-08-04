export const QUERY_KEY = {
  search: {
    searchAddress: (searchTerm: string) =>
      ['search', 'address', searchTerm] as const,
  },
  festival: {
    list: () => ['festival', 'list'] as const,
    detail: (spotId: number) => ['festival', 'detail', spotId] as const,
  },
}
