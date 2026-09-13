import { saveUserPreferences } from '@/api/preference'
import { useMutation } from '@tanstack/react-query'

export const useSaveUserPreferences = () => {
  return useMutation({
    mutationFn: saveUserPreferences,
  })
}
