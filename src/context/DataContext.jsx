import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  itemsApi,
  manufacturesApi,
  projectsApi,
  unitsApi,
  vouchersApi,
} from '../api/endpoints'
import { DataContext } from './contexts'

/**
 * The backend may return the import flag under any of these keys:
 *   IsImport | isImport | isImporting | type | voucherType
 *
 * This function resolves whichever key is present and stores the result as a
 * plain boolean under `isImport` so every component can rely on one field.
 */
function normalizeVoucher(v) {
  const candidates = [v.IsImport, v.isImport, v.isImporting]

  let isImport = null
  for (const candidate of candidates) {
    if (typeof candidate === 'boolean') {
      isImport = candidate
      break
    }
    if (typeof candidate === 'string') {
      isImport = candidate.toLowerCase() === 'true'
      break
    }
    if (candidate === 1 || candidate === 0) {
      isImport = candidate === 1
      break
    }
  }

  if (isImport === null) {
    const typeStr = v.type ?? v.voucherType ?? ''
    if (typeof typeStr === 'string' && typeStr.length > 0) {
      isImport = typeStr.toLowerCase() === 'import'
    }
  }

  if (isImport === null) isImport = false

  return { ...v, isImport }
}

function hasEntityId(entity) {
  return Boolean(entity && typeof entity === 'object' && entity.id !== undefined && entity.id !== null)
}

/**
 * Map raw API / network error messages to human-friendly Arabic/English strings.
 * Returns { ar, en } so the UI can pick based on current language.
 */
export function friendlyError(rawMessage = '') {
  const msg = rawMessage.toLowerCase()

  if (/network|fetch|econnrefused|net::err/i.test(msg)) {
    return {
      ar: 'تعذّر الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.',
      en: 'Unable to reach the server. Please check your connection and try again.',
    }
  }
  if (/401|unauthorized/i.test(msg)) {
    return {
      ar: 'غير مصرح لك بتنفيذ هذا الإجراء. يرجى تسجيل الدخول.',
      en: 'You are not authorized. Please log in and try again.',
    }
  }
  if (/403|forbidden/i.test(msg)) {
    return {
      ar: 'ليس لديك صلاحية للقيام بهذا الإجراء.',
      en: 'You do not have permission to perform this action.',
    }
  }
  if (/404|not found/i.test(msg)) {
    return {
      ar: 'البيانات المطلوبة غير موجودة.',
      en: 'The requested record was not found.',
    }
  }
  if (/409|conflict|duplicate|already exists/i.test(msg)) {
    return {
      ar: 'هذا السجل موجود مسبقاً. يرجى التحقق من البيانات.',
      en: 'A record with these details already exists.',
    }
  }
  if (/quantity|stock|enough|insufficient|كمية/i.test(msg)) {
    return {
      ar: 'الكمية المتاحة من هذا الصنف غير كافية لإتمام السند.',
      en: 'There is not enough stock for this item to complete the voucher.',
    }
  }
  if (/bad request|400|validation/i.test(msg)) {
    return {
      ar: 'بعض البيانات المُدخلة غير صحيحة. يرجى مراجعة الحقول والمحاولة مجدداً.',
      en: 'Some of the entered data is invalid. Please review the fields and try again.',
    }
  }
  if (/500|internal server/i.test(msg)) {
    return {
      ar: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
      en: 'A server error occurred. Please try again later.',
    }
  }
  if (/timeout|timed out/i.test(msg)) {
    return {
      ar: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
      en: 'The request timed out. Please try again.',
    }
  }

  return {
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    en: rawMessage || 'An unexpected error occurred. Please try again.',
  }
}

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
    try {
      setError(null)
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
        const raw = await vouchersApi.getAll()
        const vouchers = raw.map(normalizeVoucher)
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

  const syncItemAlerts = useCallback(async () => {
    try {
      await refreshMinimumNotifications()
    } catch {
      // Keep the main mutation successful even if alert refresh fails.
    }
  }, [refreshMinimumNotifications])

  const refreshAll = useCallback(async () => {
    setLoadingMap((current) => ({ ...current, bootstrap: true }))
    try {
      setError(null)
      const [items, manufactures, projects, units, rawVouchers, minimumNotifications] =
        await Promise.all([
          itemsApi.getAll(),
          manufacturesApi.getAll(),
          projectsApi.getAll(),
          unitsApi.getAll(),
          vouchersApi.getAll(),
          itemsApi.getMinimumNotifications(),
        ])

      const vouchers = rawVouchers.map(normalizeVoucher)

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
      refreshAll()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [refreshAll])

  const createItem = useCallback(
    async (payload) => {
      const created = await withLoading('items', () => itemsApi.create(payload))
      if (hasEntityId(created)) {
        setData((current) => ({
          ...current,
          items: [created, ...current.items.filter((item) => item.id !== created.id)],
        }))
        void syncItemAlerts()
        return created
      }

      const items = await refreshItems()
      await syncItemAlerts()
      return (
        items.find(
          (item) => item.itemCode === payload.itemCode || item.name?.trim() === payload.name?.trim(),
        ) ?? created
      )
    },
    [refreshItems, syncItemAlerts, withLoading],
  )

  const updateItem = useCallback(
    async (id, payload) => {
      const updated = await withLoading('items', () => itemsApi.update(id, payload))
      if (hasEntityId(updated)) {
        setData((current) => ({
          ...current,
          items: current.items.map((item) => (item.id === id ? updated : item)),
        }))
        void syncItemAlerts()
        return updated
      }

      const items = await refreshItems()
      await syncItemAlerts()
      return items.find((item) => item.id === id) ?? updated
    },
    [refreshItems, syncItemAlerts, withLoading],
  )

  const deleteItem = useCallback(
    async (id) => {
      await withLoading('items', () => itemsApi.remove(id))
      setData((current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
      }))
      void syncItemAlerts()
    },
    [syncItemAlerts, withLoading],
  )

  const createProject = useCallback(
    async (payload) => {
      const created = await withLoading('projects', () => projectsApi.create(payload))
      if (hasEntityId(created)) {
        setData((current) => ({
          ...current,
          projects: [created, ...current.projects.filter((project) => project.id !== created.id)],
        }))
        return created
      }

      const projects = await refreshProjects()
      return (
        projects.find(
          (project) =>
            project.projectNumber?.trim() === payload.projectNumber?.trim() ||
            project.projectName?.trim() === payload.projectNumber?.trim() ||
            project.name?.trim() === payload.name?.trim(),
        ) ?? created
      )
    },
    [refreshProjects, withLoading],
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
      if (hasEntityId(created)) {
        setData((current) => ({
          ...current,
          units: [created, ...current.units.filter((unit) => unit.id !== created.id)],
        }))
        return created
      }

      const units = await refreshUnits()
      return units.find((unit) => unit.name?.trim() === payload.name?.trim()) ?? created
    },
    [refreshUnits, withLoading],
  )

  const updateUnit = useCallback(
    async (id, payload) => {
      const updated = await withLoading('units', () => unitsApi.update(id, payload))
      setData((current) => ({
        ...current,
        units: current.units.map((unit) => (unit.id === id ? updated : unit)),
      }))
      return updated
    },
    [withLoading],
  )

  const deleteUnit = useCallback(
    async (id) => {
      await withLoading('units', () => unitsApi.remove(id))
      setData((current) => ({
        ...current,
        units: current.units.filter((unit) => unit.id !== id),
      }))
    },
    [withLoading],
  )

  const createManufacture = useCallback(
    async (payload) => {
      const created = await withLoading('manufactures', () => manufacturesApi.create(payload))
      if (hasEntityId(created)) {
        setData((current) => ({
          ...current,
          manufactures: [
            created,
            ...current.manufactures.filter((manufacture) => manufacture.id !== created.id),
          ],
        }))
        return created
      }

      const manufactures = await refreshManufactures()
      return (
        manufactures.find((manufacture) => manufacture.name?.trim() === payload.name?.trim()) ??
        created
      )
    },
    [refreshManufactures, withLoading],
  )

  const updateManufacture = useCallback(
    async (id, payload) => {
      const updated = await withLoading('manufactures', () =>
        manufacturesApi.update(id, payload),
      )
      setData((current) => ({
        ...current,
        manufactures: current.manufactures.map((manufacture) =>
          manufacture.id === id ? updated : manufacture,
        ),
      }))
      return updated
    },
    [withLoading],
  )

  const deleteManufacture = useCallback(
    async (id) => {
      await withLoading('manufactures', () => manufacturesApi.remove(id))
      setData((current) => ({
        ...current,
        manufactures: current.manufactures.filter((manufacture) => manufacture.id !== id),
      }))
    },
    [withLoading],
  )

  const createVoucher = useCallback(
    async (payload) => {
      const raw = await withLoading('vouchers', () => vouchersApi.create(payload))
      const created = normalizeVoucher(raw ?? {})

      if (hasEntityId(created)) {
        setData((current) => ({
          ...current,
          vouchers: [created, ...current.vouchers.filter((voucher) => voucher.id !== created.id)],
        }))
      } else {
        await refreshVouchers()
      }

      await Promise.allSettled([refreshItems(), refreshMinimumNotifications()])
      return hasEntityId(created) ? created : null
    },
    [refreshItems, refreshMinimumNotifications, refreshVouchers, withLoading],
  )

  const deleteVoucher = useCallback(
    async (id) => {
      await withLoading('vouchers', () => vouchersApi.remove(id))
      setData((current) => ({
        ...current,
        vouchers: current.vouchers.filter((voucher) => voucher.id !== id),
      }))
      await Promise.allSettled([refreshItems(), refreshMinimumNotifications()])
    },
    [refreshItems, refreshMinimumNotifications, withLoading],
  )

  const exportVouchersToExcel = useCallback(
    async (payload) => withLoading('vouchers', () => vouchersApi.exportExcel(payload)),
    [withLoading],
  )

  const exportItemsToExcel = useCallback(
    async (payload) => withLoading('items', () => itemsApi.exportExcel(payload)),
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
      updateUnit,
      deleteUnit,
      createManufacture,
      updateManufacture,
      deleteManufacture,
      createVoucher,
      deleteVoucher,
      exportVouchersToExcel,
      exportItemsToExcel,
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
      updateUnit,
      deleteUnit,
      createManufacture,
      updateManufacture,
      deleteManufacture,
      createVoucher,
      deleteVoucher,
      exportVouchersToExcel,
      exportItemsToExcel,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
