import { queryClient } from '@/lib/query-client'
import { router } from '@/router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import LanguageProvider from './language-provider'
import ModalProvider from './modal-provider'
import { Toaster } from 'sonner'

function Provider() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <ModalProvider />
        <Toaster position="top-center" richColors className="mx-auto max-w-107.5" />
      </LanguageProvider>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export default Provider
