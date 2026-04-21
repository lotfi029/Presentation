import { useState } from 'react'
import Card from '../shared/Card'
import Table from '../shared/Table'
import Button from '../shared/Button'
import ManufactureForm from '../forms/ManufactureForm'
import EditModal from '../modals/EditModal'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'

export default function ManufacturesManagement() {
  const { manufactures, createManufacture, updateManufacture, deleteManufacture, loadingMap } =
    useData()
  const { t } = useLanguage()
  const notification = useNotification()
  const [editingManufacture, setEditingManufacture] = useState(null)

  const labels = {
    manufacture: t('manufacture'),
    save: t('save'),
  }

  const editLabels = {
    manufacture: t('manufacture'),
    save: t('update'),
  }

  const handleCreate = async (values) => {
    try {
      await createManufacture(values)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleUpdate = async (values) => {
    try {
      await updateManufacture(editingManufacture.id, values)
      setEditingManufacture(null)
      notification.success(t('updateSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return

    try {
      await deleteManufacture(id)
      notification.success(t('deleteSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  return (
    <>
      <div className="content-grid">
        <Card title={t('addNew')} subtitle={t('manufacturesSub')}>
          <ManufactureForm
            onSubmit={handleCreate}
            loading={loadingMap.manufactures}
            labels={labels}
          />
        </Card>

        <Card title={t('manufactures')}>
          <Table
            columns={[
              { key: 'name', label: t('manufacture') },
              { key: 'actions', label: t('actions') },
            ]}
            data={manufactures}
            emptyMessage={t('empty')}
            renderRow={(manufacture) => (
              <tr key={manufacture.id}>
                <td>{manufacture.name}</td>
                <td>
                  <Button
                    variant="ghost"
                    className="btn-sm"
                    onClick={() => setEditingManufacture(manufacture)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => handleDelete(manufacture.id)}
                  >
                    {t('delete')}
                  </Button>
                </td>
              </tr>
            )}
          />
        </Card>
      </div>

      <EditModal
        open={Boolean(editingManufacture)}
        title={t('edit')}
        onClose={() => setEditingManufacture(null)}
      >
        {editingManufacture ? (
          <ManufactureForm
            key={editingManufacture.id}
            onSubmit={handleUpdate}
            loading={loadingMap.manufactures}
            labels={editLabels}
            initialValues={{ name: editingManufacture.name }}
          />
        ) : null}
      </EditModal>
    </>
  )
}
