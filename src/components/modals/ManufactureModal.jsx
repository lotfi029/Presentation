import ManufactureForm from '../forms/ManufactureForm'
import Button from '../shared/Button'

export default function ManufactureModal({ open, onClose, onCreate, loading, labels }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{labels.addManufacture}</h3>
          <Button variant="ghost" onClick={onClose}>
            {labels.cancel}
          </Button>
        </div>
        <ManufactureForm onSubmit={onCreate} loading={loading} labels={labels} />
      </div>
    </div>
  )
}
