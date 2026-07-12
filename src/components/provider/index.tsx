import { queryClient } from '@/lib/query-client'
import { router } from '@/router'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import LanguageProvider from './language-provider'

function Provider() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default Provider
