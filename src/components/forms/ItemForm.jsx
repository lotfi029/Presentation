import { itemSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import Button from '../shared/Button'
import FormGroup from '../shared/FormGroup'

export default function ItemForm({ initialValues, onSubmit, loading, labels }) {
  const defaultValues =
    initialValues ?? {
      name: '',
      itemCode: '',
      quantity: 0,
      minQuantity: 0,
      maxQuantity: 1,
    }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    schema: itemSchema,
    defaultValues,
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    if (!initialValues) {
      window.setTimeout(() => reset(defaultValues), 0)
    }
  })

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <FormGroup label={labels.itemName} error={errors.name?.message} required>
          <input className={`form-control ${errors.name ? 'form-control-error' : ''}`} {...register('name')} />
        </FormGroup>
        <FormGroup label={labels.itemCode} error={errors.itemCode?.message} required>
          <input
            className={`form-control ${errors.itemCode ? 'form-control-error' : ''}`}
            {...register('itemCode')}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup label={labels.minQuantity} error={errors.minQuantity?.message} required>
          <input
            className={`form-control ${errors.minQuantity ? 'form-control-error' : ''}`}
            type="number"
            {...register('minQuantity')}
          />
        </FormGroup>
        <FormGroup label={labels.maxQuantity} error={errors.maxQuantity?.message} required>
          <input
            className={`form-control ${errors.maxQuantity ? 'form-control-error' : ''}`}
            type="number"
            {...register('maxQuantity')}
          />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup label={labels.quantity} error={errors.quantity?.message} required>
          <input
            className={`form-control ${errors.quantity ? 'form-control-error' : ''}`}
            type="number"
            {...register('quantity')}
          />
        </FormGroup>
      </div>
      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={!isValid || isSubmitting || loading}>
          {labels.save}
        </Button>
      </div>
    </form>
  )
}
