import { createContext, useCallback, useRef, useState } from 'react'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback((settings) => {
    return new Promise((resolve) => {
      resolver.current = resolve
      setOptions(settings)
    })
  }, [])

  const answer = (value) => {
    resolver.current(value)
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && <ConfirmDialog {...options} onConfirm={() => answer(true)} onCancel={() => answer(false)} />}
    </ConfirmContext.Provider>
  )
}
