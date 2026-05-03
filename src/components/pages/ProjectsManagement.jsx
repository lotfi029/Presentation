import Card from '../shared/Card'
import ProjectForm from '../forms/ProjectForm'
import Table from '../shared/Table'
import Button from '../shared/Button'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'

export default function ProjectsManagement() {
  const { projects, createProject, deleteProject, loadingMap } = useData()
  const { t } = useLanguage()
  const notification = useNotification()

  const handleCreate = async (values) => {
    try {
      await createProject(values)
      notification.success(t('createSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return
    try {
      await deleteProject(id)
      notification.success(t('deleteSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  return (
    <div className="content-grid">
      <Card title={t('addNew')} subtitle={t('projectsSub')}>
        <ProjectForm
          onSubmit={handleCreate}
          loading={loadingMap.projects}
          labels={{
            projectNumber: t('projectNumber'),
            project: t('project'),
            location: t('location'),
            save: t('save'),
          }}
        />
      </Card>

      <Card title={t('projects')}>
        <Table
          columns={[
            { key: 'projectNumber', label: t('projectNumber') },
            { key: 'name', label: t('project') },
            { key: 'location', label: t('location') },
            { key: 'actions', label: t('actions') },
          ]}
          data={projects}
          emptyMessage={t('empty')}
          renderRow={(project) => (
            <tr key={project.id}>
              <td>{project.projectNumber ?? project.projectName ?? '-'}</td>
              <td>{project.name}</td>
              <td>{project.location}</td>
              <td>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => handleDelete(project.id)}
                >
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
