export const QUERY_KEY = {
  search: {
    searchAddress: (searchTerm: string) =>
      ['search', 'address', searchTerm] as const,
  },
}
