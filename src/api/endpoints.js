import apiClient from './client'

const resource = (path) => ({
  getAll: async () => (await apiClient.get(path)).data,
  getById: async (id) => (await apiClient.get(`${path}/${id}`)).data,
  create: async (payload) => (await apiClient.post(path, payload)).data,
  update: async (id, payload) => (await apiClient.put(`${path}/${id}`, payload)).data,
  remove: async (id) => (await apiClient.delete(`${path}/${id}`)).data,
})

export const itemsApi = {
  ...resource('/api/items'),
  getMinimumNotifications: async () =>
    (await apiClient.get('/api/items/minimum-notification')).data,
  exportExcel: async (payload) =>
    (
      await apiClient.post('/api/items/export/excel', payload, {
        responseType: 'blob',
      })
    ).data,
}
export const manufacturesApi = resource('/api/manufactures')
export const projectsApi = resource('/api/projects')
export const unitsApi = resource('/api/units')
export const vouchersApi = {
  ...resource('/api/vouchers'),
  exportExcel: async (payload) =>
    (
      await apiClient.post('/api/vouchers/export/excel', payload, {
        responseType: 'blob',
      })
    ).data,
}
