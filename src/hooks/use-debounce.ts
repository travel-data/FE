import { useEffect, useState } from 'react'

function useDebounce(value: string, ms: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, ms)

    return () => clearTimeout(timer)
  }, [value, ms])

  return debouncedValue
}

export default useDebounce
