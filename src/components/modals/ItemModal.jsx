import ItemForm from '../forms/ItemForm'
import Button from '../shared/Button'

export default function ItemModal({ open, onClose, onCreate, loading, labels }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{labels.addItem}</h3>
          <Button variant="ghost" onClick={onClose}>
            {labels.cancel}
          </Button>
        </div>
        <ItemForm
          onSubmit={onCreate}
          loading={loading}
          labels={{
            itemName: labels.itemName,
            itemCode: labels.itemCode,
            quantity: labels.quantity,
            minQuantity: labels.minQuantity,
            save: labels.save,
          }}
        />
      </div>
    </div>
  )
}
