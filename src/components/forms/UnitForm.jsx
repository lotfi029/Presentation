import { simpleNameSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import Button from '../shared/Button'
import FormGroup from '../shared/FormGroup'

export default function UnitForm({ onSubmit, loading, labels, initialValues }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    schema: simpleNameSchema,
    defaultValues: initialValues ?? { name: '' },
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    if (!initialValues) {
      reset()
    }
  })

  return (
    <form onSubmit={submit}>
      <FormGroup label={labels.unit} error={errors.name?.message} required>
        <input className="form-control" {...register('name')} />
      </FormGroup>
      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={loading}>
          {labels.save}
        </Button>
      </div>
    </form>
  )
}
