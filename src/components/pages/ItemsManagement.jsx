import Card from '../shared/Card'
import ItemForm from '../forms/ItemForm'
import Table from '../shared/Table'
import Button from '../shared/Button'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'
import { formatNumber } from '../../utils/formatters'

export default function ItemsManagement() {
  const { items, createItem, deleteItem, loadingMap } = useData()
  const { t, language } = useLanguage()
  const notification = useNotification()
  const locale = language === 'ar' ? 'ar-EG' : 'en-US'

  const handleCreate = async (values) => {
    try {
      await createItem(values)
      notification.success(t('createSuccess'))
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
            maxQuantity: t('maxQuantity'),
            save: t('save'),
          }}
        />
      </Card>

      <Card title={t('items')}>
        <Table
          columns={[
            { key: 'name', label: t('itemName') },
            { key: 'itemCode', label: t('itemCode') },
            { key: 'quantity', label: t('quantity') },
            { key: 'min', label: t('minQuantity') },
            { key: 'max', label: t('maxQuantity') },
            { key: 'actions', label: t('actions') },
          ]}
          data={items}
          emptyMessage={t('empty')}
          renderRow={(item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.itemCode}</td>
              <td>{formatNumber(item.quantity, locale)}</td>
              <td>{formatNumber(item.minQuantity, locale)}</td>
              <td>{formatNumber(item.maxQuantity, locale)}</td>
              <td>
                <Button variant="danger" className="btn-sm" onClick={() => handleDelete(item.id)}>
                  {t('delete')}
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  )
}
