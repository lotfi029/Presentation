import { useMemo, useState } from 'react'
import Card from '../shared/Card'
import ItemForm from '../forms/ItemForm'
import Table from '../shared/Table'
import Button from '../shared/Button'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'
import { friendlyError } from '../../context/DataContext'
import { downloadBlob, formatNumber } from '../../utils/formatters'
import EditModal from '../modals/EditModal'

export default function ItemsManagement() {
  const { items, createItem, updateItem, deleteItem, exportItemsToExcel, loadingMap } = useData()
  const { t, language } = useLanguage()
  const notification = useNotification()
  const locale = language === 'ar' ? 'ar-EG' : 'en-US'
  const [editingItem, setEditingItem] = useState(null)
  const [filters, setFilters] = useState({
    name: '',
    itemCode: '',
    minQuantity: '',
    maxQuantity: '',
  })

  const filteredItems = useMemo(() => {
    const normalizedName = filters.name.trim().toLowerCase()
    const normalizedCode = filters.itemCode.trim().toLowerCase()

    return items.filter((item) => {
      if (normalizedName && !item.name?.toLowerCase().includes(normalizedName)) return false
      if (normalizedCode && !item.itemCode?.toLowerCase().includes(normalizedCode)) return false
      if (filters.minQuantity !== '' && Number(item.quantity) < Number(filters.minQuantity)) {
        return false
      }
      if (filters.maxQuantity !== '' && Number(item.quantity) > Number(filters.maxQuantity)) {
        return false
      }
      return true
    })
  }, [filters, items])

  const buildExportPayload = () => ({
    name: filters.name.trim() || null,
    itemCode: filters.itemCode.trim() || null,
    minQuantity: filters.minQuantity === '' ? null : Number(filters.minQuantity),
    maxQuantity: filters.maxQuantity === '' ? null : Number(filters.maxQuantity),
  })

  const handleCreate = async (values) => {
    try {
      await createItem(values)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleUpdate = async (values) => {
    if (!editingItem) return

    try {
      await updateItem(editingItem.id, values)
      setEditingItem(null)
      notification.success(t('updateSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return
    try {
      await deleteItem(id)
      notification.success(t('deleteSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportItemsToExcel(buildExportPayload())
      downloadBlob(blob, 'items.xlsx')
      notification.success(t('exportSuccess'))
    } catch (error) {
      const friendly = friendlyError(error?.message ?? '')
      notification.error(language === 'ar' ? friendly.ar : friendly.en)
    }
  }

  return (
    <div className="content-grid">
      <Card title={t('addNew')} subtitle={t('itemsSub')}>
        <ItemForm
          onSubmit={handleCreate}
          loading={loadingMap.items}
          labels={{
            itemName: t('itemName'),
            itemCode: t('itemCode'),
            quantity: t('quantity'),
            minQuantity: t('minQuantity'),
            save: t('save'),
          }}
        />
      </Card>

      <Card
        title={t('items')}
        actions={
          <Button variant="primary" onClick={handleExport} disabled={loadingMap.items}>
            {t('exportExcel')}
          </Button>
        }
      >
        <div className="filter-row">
          <input
            className="form-control"
            value={filters.name}
            placeholder={t('itemName')}
            onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            className="form-control"
            value={filters.itemCode}
            placeholder={t('itemCode')}
            onChange={(event) =>
              setFilters((current) => ({ ...current, itemCode: event.target.value }))
            }
          />
          <input
            className="form-control"
            type="number"
            value={filters.minQuantity}
            placeholder={t('minQuantity')}
            onChange={(event) =>
              setFilters((current) => ({ ...current, minQuantity: event.target.value }))
            }
          />
          <input
            className="form-control"
            type="number"
            value={filters.maxQuantity}
            placeholder={t('maxQuantity')}
            onChange={(event) =>
              setFilters((current) => ({ ...current, maxQuantity: event.target.value }))
            }
          />
        </div>

        <Table
          columns={[
            { key: 'name', label: t('itemName') },
            { key: 'itemCode', label: t('itemCode') },
            { key: 'quantity', label: t('quantity') },
            { key: 'min', label: t('minQuantity') },
            { key: 'actions', label: t('actions') },
          ]}
          data={filteredItems}
          emptyMessage={t('empty')}
          renderRow={(item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.itemCode}</td>
              <td>{formatNumber(item.quantity, locale)}</td>
              <td>{formatNumber(item.minQuantity, locale)}</td>
              <td className="table-actions">
                <Button variant="ghost" className="btn-sm" onClick={() => setEditingItem(item)}>
                  {t('edit')}
                </Button>
                <Button variant="danger" className="btn-sm" onClick={() => handleDelete(item.id)}>
                  {t('delete')}
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <EditModal
        open={Boolean(editingItem)}
        title={t('edit')}
        onClose={() => setEditingItem(null)}
      >
        {editingItem ? (
          <ItemForm
            initialValues={{
              name: editingItem.name,
              itemCode: editingItem.itemCode,
              quantity: editingItem.quantity,
              minQuantity: editingItem.minQuantity,
            }}
            onSubmit={handleUpdate}
            loading={loadingMap.items}
            labels={{
              itemName: t('itemName'),
              itemCode: t('itemCode'),
              quantity: t('quantity'),
              minQuantity: t('minQuantity'),
              save: t('update'),
            }}
          />
        ) : null}
      </EditModal>
    </div>
  )
}
