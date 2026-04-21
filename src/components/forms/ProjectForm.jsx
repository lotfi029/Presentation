import { projectSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import Button from '../shared/Button'
import FormGroup from '../shared/FormGroup'

export default function ProjectForm({ onSubmit, loading, labels }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    schema: projectSchema,
    defaultValues: {
      name: '',
      location: '',
    },
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    reset({ name: '', location: '' })
  })

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <FormGroup label={labels.project} error={errors.name?.message} required>
          <input className="form-control" {...register('name')} />
        </FormGroup>
        <FormGroup label={labels.location} error={errors.location?.message} required>
          <input className="form-control" {...register('location')} />
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
