import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  itemsApi,
  manufacturesApi,
  projectsApi,
  unitsApi,
  vouchersApi,
} from '../api/endpoints'
import { DataContext } from './contexts'

const initialData = {
  items: [],
  manufactures: [],
  projects: [],
  units: [],
  vouchers: [],
  minimumNotifications: [],
}

export function DataProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [loadingMap, setLoadingMap] = useState({
    bootstrap: true,
    items: false,
    manufactures: false,
    projects: false,
    units: false,
    vouchers: false,
    minimumNotifications: false,
  })
  const [error, setError] = useState(null)

  const withLoading = useCallback(async (key, action) => {
    setLoadingMap((current) => ({ ...current, [key]: true }))
    setError(null)
    try {
      return await action()
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoadingMap((current) => ({ ...current, [key]: false }))
    }
  }, [])

  const refreshItems = useCallback(
    () =>
      withLoading('items', async () => {
        const items = await itemsApi.getAll()
        setData((current) => ({ ...current, items }))
        return items
      }),
    [withLoading],
  )

  const refreshManufactures = useCallback(
    () =>
      withLoading('manufactures', async () => {
        const manufactures = await manufacturesApi.getAll()
        setData((current) => ({ ...current, manufactures }))
        return manufactures
      }),
    [withLoading],
  )

  const refreshProjects = useCallback(
    () =>
      withLoading('projects', async () => {
        const projects = await projectsApi.getAll()
        setData((current) => ({ ...current, projects }))
        return projects
      }),
    [withLoading],
  )

  const refreshUnits = useCallback(
    () =>
      withLoading('units', async () => {
        const units = await unitsApi.getAll()
        setData((current) => ({ ...current, units }))
        return units
      }),
    [withLoading],
  )

  const refreshVouchers = useCallback(
    () =>
      withLoading('vouchers', async () => {
        const vouchers = await vouchersApi.getAll()
        setData((current) => ({ ...current, vouchers }))
        return vouchers
      }),
    [withLoading],
  )

  const refreshMinimumNotifications = useCallback(
    () =>
      withLoading('minimumNotifications', async () => {
        const minimumNotifications = await itemsApi.getMinimumNotifications()
        setData((current) => ({ ...current, minimumNotifications }))
        return minimumNotifications
      }),
    [withLoading],
  )

  const refreshAll = useCallback(async () => {
    setLoadingMap((current) => ({ ...current, bootstrap: true }))
    try {
      const [items, manufactures, projects, units, vouchers, minimumNotifications] =
        await Promise.all([
          itemsApi.getAll(),
          manufacturesApi.getAll(),
          projectsApi.getAll(),
          unitsApi.getAll(),
          vouchersApi.getAll(),
          itemsApi.getMinimumNotifications(),
        ])

      setData({ items, manufactures, projects, units, vouchers, minimumNotifications })
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoadingMap((current) => ({ ...current, bootstrap: false }))
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshAll().catch(() => {})
    }, 0)

    return () => window.clearTimeout(timer)
  }, [refreshAll])

  const createItem = useCallback(
    async (payload) => {
      const created = await withLoading('items', () => itemsApi.create(payload))
      setData((current) => ({ ...current, items: [created, ...current.items] }))
      return created
    },
    [withLoading],
  )

  const updateItem = useCallback(
    async (id, payload) => {
      const updated = await withLoading('items', () => itemsApi.update(id, payload))
      setData((current) => ({
        ...current,
        items: current.items.map((item) => (item.id === id ? updated : item)),
      }))
      return updated
    },
    [withLoading],
  )

  const deleteItem = useCallback(
    async (id) => {
      await withLoading('items', () => itemsApi.remove(id))
      setData((current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
      }))
    },
    [withLoading],
  )

  const createProject = useCallback(
    async (payload) => {
      const created = await withLoading('projects', () => projectsApi.create(payload))
      setData((current) => ({ ...current, projects: [created, ...current.projects] }))
      return created
    },
    [withLoading],
  )

  const updateProject = useCallback(
    async (id, payload) => {
      const updated = await withLoading('projects', () => projectsApi.update(id, payload))
      setData((current) => ({
        ...current,
        projects: current.projects.map((project) => (project.id === id ? updated : project)),
      }))
      return updated
    },
    [withLoading],
  )

  const deleteProject = useCallback(
    async (id) => {
      await withLoading('projects', () => projectsApi.remove(id))
      setData((current) => ({
        ...current,
        projects: current.projects.filter((project) => project.id !== id),
      }))
    },
    [withLoading],
  )

  const createUnit = useCallback(
    async (payload) => {
      const created = await withLoading('units', () => unitsApi.create(payload))
      setData((current) => ({ ...current, units: [created, ...current.units] }))
      return created
    },
    [withLoading],
  )

  const createManufacture = useCallback(
    async (payload) => {
      const created = await withLoading('manufactures', () => manufacturesApi.create(payload))
      setData((current) => ({ ...current, manufactures: [created, ...current.manufactures] }))
      return created
    },
    [withLoading],
  )

  const createVoucher = useCallback(
    async (payload) => {
      const created = await withLoading('vouchers', () => vouchersApi.create(payload))
      setData((current) => ({ ...current, vouchers: [created, ...current.vouchers] }))
      return created
    },
    [withLoading],
  )

  const deleteVoucher = useCallback(
    async (id) => {
      await withLoading('vouchers', () => vouchersApi.remove(id))
      setData((current) => ({
        ...current,
        vouchers: current.vouchers.filter((voucher) => voucher.id !== id),
      }))
    },
    [withLoading],
  )

  const exportVouchersToExcel = useCallback(
    async (payload) => withLoading('vouchers', () => vouchersApi.exportExcel(payload)),
    [withLoading],
  )

  const value = useMemo(
    () => ({
      ...data,
      loadingMap,
      error,
      refreshAll,
      refreshItems,
      refreshManufactures,
      refreshProjects,
      refreshUnits,
      refreshVouchers,
      refreshMinimumNotifications,
      createItem,
      updateItem,
      deleteItem,
      createProject,
      updateProject,
      deleteProject,
      createUnit,
      createManufacture,
      createVoucher,
      deleteVoucher,
      exportVouchersToExcel,
    }),
    [
      data,
      loadingMap,
      error,
      refreshAll,
      refreshItems,
      refreshManufactures,
      refreshProjects,
      refreshUnits,
      refreshVouchers,
      refreshMinimumNotifications,
      createItem,
      updateItem,
      deleteItem,
      createProject,
      updateProject,
      deleteProject,
      createUnit,
      createManufacture,
      createVoucher,
      deleteVoucher,
      exportVouchersToExcel,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
