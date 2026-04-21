import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'

const iconMap = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertCircle,
  info: FiInfo,
}

export default function Notification({ toasts, onDismiss }) {
  return (
    <div className="notif-panel">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || FiInfo
        return (
          <div key={toast.id} className={`notif-toast ${toast.type}`}>
            <Icon />
            <span>{toast.message}</span>
            <button className="notif-close" onClick={() => onDismiss(toast.id)}>
              <FiX />
            </button>
          </div>
        )
      })}
    </div>
  )
}
