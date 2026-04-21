import { useEffect, useMemo, useState } from 'react'
import { voucherSchema } from '../../utils/validators'
import { useForm } from '../../hooks/useForm'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'
import FormGroup from '../shared/FormGroup'
import Button from '../shared/Button'
import UnitModal from '../modals/UnitModal'
import ManufactureModal from '../modals/ManufactureModal'
import ItemModal from '../modals/ItemModal'
import SearchableSelect from '../shared/SearchableSelect'

export default function VoucherForm() {
  const defaultValues = {
    voucherType: 'import',
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
    createItem,
    createUnit,
    createManufacture,
    createVoucher,
    refreshMinimumNotifications,
  } = useData()
  const { t } = useLanguage()
  const notification = useNotification()
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [unitModalOpen, setUnitModalOpen] = useState(false)
  const [manufactureModalOpen, setManufactureModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    schema: voucherSchema,
    defaultValues,
  })

  const voucherType = watch('voucherType')
  const itemId = watch('itemId')
  const unitId = watch('unitId')
  const manufacturerId = watch('manufacturerId')
  const projectId = watch('projectId')

  const typeOptions = useMemo(
    () => [
      { value: 'import', label: t('import') },
      { value: 'export', label: t('export') },
    ],
    [t],
  )
  const itemOptions = useMemo(
    () =>
      items.map((item) => ({
        value: item.id,
        label: `${item.itemCode} - ${item.name}`,
      })),
    [items],
  )
  const unitOptions = useMemo(
    () =>
      units.map((unit) => ({
        value: unit.id,
        label: unit.name,
      })),
    [units],
  )
  const manufactureOptions = useMemo(
    () =>
      manufactures.map((manufacture) => ({
        value: manufacture.id,
        label: manufacture.name,
      })),
    [manufactures],
  )
  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id,
        label: project.name,
      })),
    [projects],
  )

  const submit = handleSubmit(async (values) => {
    try {
      await createVoucher({
        IsImport: values.voucherType === 'import',
        voucherNumber: values.voucherNumber,
        itemId: Number(values.itemId),
        quantity: Number(values.quantity),
        price: Number(values.price),
        manufacturerId: Number(values.manufacturerId),
        unitId: Number(values.unitId),
        projectId: Number(values.projectId),
        notes: values.notes?.trim() ? values.notes.trim() : null,
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
      const friendlyMessage =
        /bad request|quantity|stock|enough|insufficient/i.test(error.message)
          ? t('insufficientQuantity')
          : error.message
      notification.error(friendlyMessage)
    }
  })

  useEffect(() => {
    register('voucherType')
    register('itemId')
    register('unitId')
    register('manufacturerId')
    register('projectId')
  }, [register])

  const createInlineItem = async (payload) => {
    try {
      const created = await createItem(payload)
      setValue('itemId', String(created.id), { shouldValidate: true, shouldDirty: true })
      setItemModalOpen(false)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const createInlineUnit = async (payload) => {
    try {
      const created = await createUnit(payload)
      setValue('unitId', String(created.id), { shouldValidate: true, shouldDirty: true })
      setUnitModalOpen(false)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const createInlineManufacture = async (payload) => {
    try {
      const created = await createManufacture(payload)
      setValue('manufacturerId', String(created.id), { shouldValidate: true, shouldDirty: true })
      setManufactureModalOpen(false)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const labels = {
    addItem: t('addItem'),
    itemName: t('itemName'),
    itemCode: t('itemCode'),
    quantity: t('quantity'),
    minQuantity: t('minQuantity'),
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
            <SearchableSelect
              value={voucherType}
              onChange={(value) => setValue('voucherType', value, { shouldValidate: true, shouldDirty: true })}
              options={typeOptions}
              placeholder={t('type')}
              searchPlaceholder={t('search')}
              error={errors.voucherType?.message}
            />
          </FormGroup>
          <FormGroup label={t('voucherNumber')} error={errors.voucherNumber?.message} required>
            <input
              className={`form-control ${errors.voucherNumber ? 'form-control-error' : ''}`}
              {...register('voucherNumber')}
            />
          </FormGroup>
        </div>

        <div className="form-row">
          <FormGroup
            label={t('item')}
            error={errors.itemId?.message}
            required
            actions={
              <Button type="button" variant="ghost" className="btn-sm" onClick={() => setItemModalOpen(true)}>
                + {t('addItem')}
              </Button>
            }
          >
            <SearchableSelect
              value={itemId}
              onChange={(value) => setValue('itemId', value, { shouldValidate: true, shouldDirty: true })}
              options={itemOptions}
              placeholder={t('item')}
              searchPlaceholder={t('search')}
              error={errors.itemId?.message}
            />
          </FormGroup>
          <div />
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
            <SearchableSelect
              value={unitId}
              onChange={(value) => setValue('unitId', value, { shouldValidate: true, shouldDirty: true })}
              options={unitOptions}
              placeholder={t('unit')}
              searchPlaceholder={t('search')}
              error={errors.unitId?.message}
            />
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
            <SearchableSelect
              value={projectId}
              onChange={(value) => setValue('projectId', value, { shouldValidate: true, shouldDirty: true })}
              options={projectOptions}
              placeholder={t('project')}
              searchPlaceholder={t('search')}
              error={errors.projectId?.message}
            />
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
            <SearchableSelect
              value={manufacturerId}
              onChange={(value) =>
                setValue('manufacturerId', value, { shouldValidate: true, shouldDirty: true })
              }
              options={manufactureOptions}
              placeholder={t('manufacture')}
              searchPlaceholder={t('search')}
              error={errors.manufacturerId?.message}
            />
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

      <ItemModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onCreate={createInlineItem}
        loading={isSubmitting}
        labels={labels}
      />
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
