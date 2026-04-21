import { useState } from 'react'
import Card from '../shared/Card'
import Table from '../shared/Table'
import Button from '../shared/Button'
import UnitForm from '../forms/UnitForm'
import EditModal from '../modals/EditModal'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'

export default function UnitsManagement() {
  const { units, createUnit, updateUnit, deleteUnit, loadingMap } = useData()
  const { t } = useLanguage()
  const notification = useNotification()
  const [editingUnit, setEditingUnit] = useState(null)

  const labels = {
    unit: t('unit'),
    save: t('save'),
  }

  const editLabels = {
    unit: t('unit'),
    save: t('update'),
  }

  const handleCreate = async (values) => {
    try {
      await createUnit(values)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleUpdate = async (values) => {
    try {
      await updateUnit(editingUnit.id, values)
      setEditingUnit(null)
      notification.success(t('updateSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return

    try {
      await deleteUnit(id)
      notification.success(t('deleteSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  return (
    <>
      <div className="content-grid">
        <Card title={t('addNew')} subtitle={t('unitsSub')}>
          <UnitForm onSubmit={handleCreate} loading={loadingMap.units} labels={labels} />
        </Card>

        <Card title={t('units')}>
          <Table
            columns={[
              { key: 'name', label: t('unit') },
              { key: 'actions', label: t('actions') },
            ]}
            data={units}
            emptyMessage={t('empty')}
            renderRow={(unit) => (
              <tr key={unit.id}>
                <td>{unit.name}</td>
                <td>
                  <Button
                    variant="ghost"
                    className="btn-sm"
                    onClick={() => setEditingUnit(unit)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => handleDelete(unit.id)}
                  >
                    {t('delete')}
                  </Button>
                </td>
              </tr>
            )}
          />
        </Card>
      </div>

      <EditModal open={Boolean(editingUnit)} title={t('edit')} onClose={() => setEditingUnit(null)}>
        {editingUnit ? (
          <UnitForm
            key={editingUnit.id}
            onSubmit={handleUpdate}
            loading={loadingMap.units}
            labels={editLabels}
            initialValues={{ name: editingUnit.name }}
          />
        ) : null}
      </EditModal>
    </>
  )
}
