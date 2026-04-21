import { simpleNameSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import Button from '../shared/Button'
import FormGroup from '../shared/FormGroup'

export default function ManufactureForm({ onSubmit, loading, labels, initialValues }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    schema: simpleNameSchema,
    defaultValues: initialValues ?? { name: '' },
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    if (!initialValues) {
      window.setTimeout(() => reset({ name: '' }), 0)
    }
  })

  return (
    <form onSubmit={submit}>
      <FormGroup label={labels.manufacture} error={errors.name?.message} required>
        <input className={`form-control ${errors.name ? 'form-control-error' : ''}`} {...register('name')} />
      </FormGroup>
      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={!isValid || isSubmitting || loading}>
          {labels.save}
        </Button>
      </div>
    </form>
  )
}
