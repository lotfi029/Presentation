import Button from '../shared/Button'

export default function EditModal({ open, title, onClose, children }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            X
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
