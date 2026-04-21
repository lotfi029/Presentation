import UnitForm from '../forms/UnitForm'
import Button from '../shared/Button'

export default function UnitModal({ open, onClose, onCreate, loading, labels }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{labels.addUnit}</h3>
          <Button variant="ghost" onClick={onClose}>
            {labels.cancel}
          </Button>
        </div>
        <UnitForm onSubmit={onCreate} loading={loading} labels={labels} />
      </div>
    </div>
  )
}
