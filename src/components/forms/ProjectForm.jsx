import { projectSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import Button from '../shared/Button'
import FormGroup from '../shared/FormGroup'

export default function ProjectForm({ onSubmit, loading, labels }) {
  const defaultValues = {
    id: '',
    name: '',
    location: '',
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    schema: projectSchema,
    defaultValues,
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    window.setTimeout(() => reset(defaultValues), 0)
  })

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <FormGroup label={labels.id} error={errors.id?.message} required>
          <input
            type="number"
            className={`form-control ${errors.id ? 'form-control-error' : ''}`}
            {...register('id')}
          />
        </FormGroup>
        <FormGroup label={labels.project} error={errors.name?.message} required>
          <input className={`form-control ${errors.name ? 'form-control-error' : ''}`} {...register('name')} />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup label={labels.location} error={errors.location?.message} required>
          <input
            className={`form-control ${errors.location ? 'form-control-error' : ''}`}
            {...register('location')}
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
