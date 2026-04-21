import { itemSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import Button from '../shared/Button'
import FormGroup from '../shared/FormGroup'

export default function ItemForm({ initialValues, onSubmit, loading, labels }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    schema: itemSchema,
    defaultValues:
      initialValues ?? {
        name: '',
        itemCode: '',
        minQuantity: 0,
        maxQuantity: 1,
      },
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    reset({
      name: '',
      itemCode: '',
      minQuantity: 0,
      maxQuantity: 1,
    })
  })

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <FormGroup label={labels.itemName} error={errors.name?.message} required>
          <input className="form-control" {...register('name')} />
        </FormGroup>
        <FormGroup label={labels.itemCode} error={errors.itemCode?.message} required>
          <input className="form-control" {...register('itemCode')} />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup label={labels.minQuantity} error={errors.minQuantity?.message} required>
          <input className="form-control" type="number" {...register('minQuantity')} />
        </FormGroup>
        <FormGroup label={labels.maxQuantity} error={errors.maxQuantity?.message} required>
          <input className="form-control" type="number" {...register('maxQuantity')} />
        </FormGroup>
      </div>
      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={loading}>
          {labels.save}
        </Button>
      </div>
    </form>
  )
}
