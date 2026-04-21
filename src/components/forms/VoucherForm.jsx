import { useState } from 'react'
import { voucherSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'
import FormGroup from '../shared/FormGroup'
import Button from '../shared/Button'
import UnitModal from '../modals/UnitModal'
import ManufactureModal from '../modals/ManufactureModal'

export default function VoucherForm() {
  const defaultValues = {
    voucherType: 'import',
    createdAt: new Date().toISOString().slice(0, 10),
    voucherNumber: '',
    itemId: '',
    quantity: 1,
    price: 0,
    manufacturerId: '',
    unitId: '',
    projectId: '',
    notes: '',
  }

  const {
    items,
    units,
    manufactures,
    projects,
    createUnit,
    createManufacture,
    createVoucher,
    refreshMinimumNotifications,
  } = useData()
  const { t } = useLanguage()
  const notification = useNotification()
  const [unitModalOpen, setUnitModalOpen] = useState(false)
  const [manufactureModalOpen, setManufactureModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    schema: voucherSchema,
    defaultValues,
  })

  const submit = handleSubmit(async (values) => {
    try {
      await createVoucher({
        isImporting: values.voucherType === 'import',
        createdAt: new Date(values.createdAt).toISOString(),
        voucherNumber: values.voucherNumber,
        itemId: Number(values.itemId),
        quantity: Number(values.quantity),
        price: Number(values.price),
        manufacturerId: Number(values.manufacturerId),
        unitId: Number(values.unitId),
        projectId: Number(values.projectId),
      })

      notification.success(t('createSuccess'))

      const minimumNotifications = await refreshMinimumNotifications()
      if (minimumNotifications.length) {
        const affectedItems = minimumNotifications
          .slice(0, 3)
          .map(
            (item) =>
              `${item.name} (${t('currentQuantity')}: ${item.quantity}, ${t('minQuantity')}: ${item.minQuantity})`,
          )
          .join(', ')
        const extraCount =
          minimumNotifications.length > 3
            ? ` ${t('andMoreItems', { count: minimumNotifications.length - 3 })}`
            : ''

        notification.warning(`${t('minimumNotificationWarning')}: ${affectedItems}.${extraCount}`)
      }

      window.setTimeout(() => reset({
        voucherType: values.voucherType,
        createdAt: new Date().toISOString().slice(0, 10),
        voucherNumber: '',
        itemId: '',
        quantity: 1,
        price: 0,
        manufacturerId: '',
        unitId: '',
        projectId: '',
        notes: '',
      }), 0)
    } catch (error) {
      notification.error(error.message)
    }
  })

  const createInlineUnit = async (payload) => {
    try {
      const created = await createUnit(payload)
      setValue('unitId', String(created.id))
      setUnitModalOpen(false)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const createInlineManufacture = async (payload) => {
    try {
      const created = await createManufacture(payload)
      setValue('manufacturerId', String(created.id))
      setManufactureModalOpen(false)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const labels = {
    unit: t('unit'),
    manufacture: t('manufacture'),
    addUnit: t('addUnit'),
    addManufacture: t('addManufacture'),
    save: t('save'),
    cancel: t('cancel'),
  }

  return (
    <>
      <form onSubmit={submit} className="voucher-form">
        <div className="form-row">
          <FormGroup label={t('type')} error={errors.voucherType?.message} required>
            <select
              className={`form-control ${errors.voucherType ? 'form-control-error' : ''}`}
              {...register('voucherType')}
            >
              <option value="import">{t('import')}</option>
              <option value="export">{t('export')}</option>
            </select>
          </FormGroup>
          <FormGroup label={t('voucherNumber')} error={errors.voucherNumber?.message} required>
            <input
              className={`form-control ${errors.voucherNumber ? 'form-control-error' : ''}`}
              {...register('voucherNumber')}
            />
          </FormGroup>
        </div>

        <div className="form-row">
          <FormGroup label={t('item')} error={errors.itemId?.message} required>
            <select className={`form-control ${errors.itemId ? 'form-control-error' : ''}`} {...register('itemId')}>
              <option value="" />
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemCode} - {item.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup label={t('date')} error={errors.createdAt?.message} required>
            <input
              className={`form-control ${errors.createdAt ? 'form-control-error' : ''}`}
              type="date"
              {...register('createdAt')}
            />
          </FormGroup>
        </div>

        <div className="form-row form-row-4">
          <FormGroup
            label={t('unit')}
            error={errors.unitId?.message}
            required
            actions={
              <Button
                type="button"
                variant="ghost"
                className="btn-sm"
                onClick={() => setUnitModalOpen(true)}
              >
                + {t('addUnit')}
              </Button>
            }
          >
            <select className={`form-control ${errors.unitId ? 'form-control-error' : ''}`} {...register('unitId')}>
              <option value="" />
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup label={t('quantity')} error={errors.quantity?.message} required>
            <input
              className={`form-control ${errors.quantity ? 'form-control-error' : ''}`}
              type="number"
              {...register('quantity')}
            />
          </FormGroup>
          <FormGroup label={t('price')} error={errors.price?.message} required>
            <input
              className={`form-control ${errors.price ? 'form-control-error' : ''}`}
              type="number"
              step="0.01"
              {...register('price')}
            />
          </FormGroup>
          <FormGroup label={t('project')} error={errors.projectId?.message} required>
            <select
              className={`form-control ${errors.projectId ? 'form-control-error' : ''}`}
              {...register('projectId')}
            >
              <option value="" />
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </FormGroup>
        </div>

        <div className="form-row">
          <FormGroup
            label={t('manufacture')}
            error={errors.manufacturerId?.message}
            required
            actions={
              <Button
                type="button"
                variant="ghost"
                className="btn-sm"
                onClick={() => setManufactureModalOpen(true)}
              >
                + {t('addManufacture')}
              </Button>
            }
          >
            <select
              className={`form-control ${errors.manufacturerId ? 'form-control-error' : ''}`}
              {...register('manufacturerId')}
            >
              <option value="" />
              {manufactures.map((manufacture) => (
                <option key={manufacture.id} value={manufacture.id}>
                  {manufacture.name}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup label={t('notes')} error={errors.notes?.message}>
            <textarea
              className={`form-control ${errors.notes ? 'form-control-error' : ''}`}
              rows="4"
              {...register('notes')}
            />
          </FormGroup>
        </div>

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={() => reset()}>
            {t('clear')}
          </Button>
          <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>
            {t('save')}
          </Button>
        </div>
      </form>

      <UnitModal
        open={unitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        onCreate={createInlineUnit}
        loading={isSubmitting}
        labels={labels}
      />
      <ManufactureModal
        open={manufactureModalOpen}
        onClose={() => setManufactureModalOpen(false)}
        onCreate={createInlineManufacture}
        loading={isSubmitting}
        labels={labels}
      />
    </>
  )
}
