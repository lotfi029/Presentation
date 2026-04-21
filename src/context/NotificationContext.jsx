import { useCallback, useMemo, useState } from 'react'
import { NotificationContext } from './contexts'
import Notification from '../components/shared/Notification'

let toastId = 0

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((message, type = 'info') => {
    const id = toastId++
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  const value = useMemo(
    () => ({
      notify,
      success: (message) => notify(message, 'success'),
      error: (message) => notify(message, 'error'),
      warning: (message) => notify(message, 'warning'),
      info: (message) => notify(message, 'info'),
    }),
    [notify],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notification toasts={toasts} onDismiss={removeToast} />
    </NotificationContext.Provider>
  )
}
