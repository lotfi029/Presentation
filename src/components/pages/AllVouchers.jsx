import { useMemo, useState } from 'react'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { useNotification } from '../../hooks/useNotification'
import { downloadBlob, formatDate, formatNumber } from '../../utils/formatters'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Table from '../shared/Table'

export default function AllVouchers() {
  const { vouchers, items, projects, manufactures, deleteVoucher, exportVouchersToExcel } =
    useData()
  const { t, language } = useLanguage()
  const notification = useNotification()
  const locale = language === 'ar' ? 'ar-EG' : 'en-US'
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    itemId: '',
    projectId: '',
    manufacturerId: '',
    minPrice: '',
    maxPrice: '',
    minQuantity: '',
    maxQuantity: '',
  })

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      const voucherDate = voucher.createdAt ? new Date(voucher.createdAt) : null
      const manufacturerId = String(
        voucher.manufacturerId ?? voucher.manufacture?.id ?? voucher.manufacturer?.id ?? '',
      )

      if (filters.startDate && voucherDate && voucherDate < new Date(filters.startDate)) return false
      if (filters.endDate && voucherDate && voucherDate > new Date(`${filters.endDate}T23:59:59.999`)) {
        return false
      }
      if (filters.itemId && String(voucher.itemId) !== filters.itemId) return false
      if (filters.projectId && String(voucher.projectId) !== filters.projectId) return false
      if (filters.manufacturerId && manufacturerId !== filters.manufacturerId) return false
      if (filters.minPrice && Number(voucher.price) < Number(filters.minPrice)) return false
      if (filters.maxPrice && Number(voucher.price) > Number(filters.maxPrice)) return false
      if (filters.minQuantity && Number(voucher.quantity) < Number(filters.minQuantity)) return false
      if (filters.maxQuantity && Number(voucher.quantity) > Number(filters.maxQuantity)) return false

      return true
    })
  }, [filters, vouchers])

  const buildExportPayload = () => {
    const payload = {
      startDate: filters.startDate ? new Date(filters.startDate).toISOString() : null,
      endDate: filters.endDate ? new Date(`${filters.endDate}T23:59:59.999`).toISOString() : null,
      itemId: filters.itemId ? Number(filters.itemId) : null,
      projectId: filters.projectId ? Number(filters.projectId) : null,
      manufacturerId: filters.manufacturerId ? Number(filters.manufacturerId) : null,
      minPrice: filters.minPrice ? Number(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
      minQuantity: filters.minQuantity ? Number(filters.minQuantity) : null,
      maxQuantity: filters.maxQuantity ? Number(filters.maxQuantity) : null,
    }

    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== null))
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return
    try {
      await deleteVoucher(id)
      notification.success(t('deleteSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportVouchersToExcel(buildExportPayload())
      downloadBlob(blob, 'vouchers.xlsx')
      notification.success(t('exportSuccess'))
    } catch (error) {
      notification.error(error.message)
    }
  }

  return (
    <Card
      title={t('allVouchers')}
      subtitle={t('allVouchersSub')}
      actions={
        <Button variant="primary" onClick={handleExport}>
          {t('exportExcel')}
        </Button>
      }
    >
      <div className="filter-row">
        <input
          className="form-control"
          type="date"
          value={filters.startDate}
          onChange={(event) =>
            setFilters((current) => ({ ...current, startDate: event.target.value }))
          }
          aria-label={t('startDate')}
        />
        <input
          className="form-control"
          type="date"
          value={filters.endDate}
          onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
          aria-label={t('endDate')}
        />
        <select
          className="form-control"
          value={filters.itemId}
          onChange={(event) => setFilters((current) => ({ ...current, itemId: event.target.value }))}
        >
          <option value="">{t('item')}</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.itemCode} - {item.name}
            </option>
          ))}
        </select>
        <select
          className="form-control"
          value={filters.projectId}
          onChange={(event) =>
            setFilters((current) => ({ ...current, projectId: event.target.value }))
          }
        >
          <option value="">{t('project')}</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          className="form-control"
          value={filters.manufacturerId}
          onChange={(event) =>
            setFilters((current) => ({ ...current, manufacturerId: event.target.value }))
          }
        >
          <option value="">{t('manufacture')}</option>
          {manufactures.map((manufacture) => (
            <option key={manufacture.id} value={manufacture.id}>
              {manufacture.name}
            </option>
          ))}
        </select>
        <input
          className="form-control"
          type="number"
          step="0.01"
          value={filters.minPrice}
          placeholder={t('minPrice')}
          onChange={(event) =>
            setFilters((current) => ({ ...current, minPrice: event.target.value }))
          }
        />
        <input
          className="form-control"
          type="number"
          step="0.01"
          value={filters.maxPrice}
          placeholder={t('maxPrice')}
          onChange={(event) =>
            setFilters((current) => ({ ...current, maxPrice: event.target.value }))
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

      <div className="filter-summary muted">{t('filteredCount', { count: filteredVouchers.length })}</div>

      <Table
        columns={[
          { key: 'type', label: t('type') },
          { key: 'voucherNumber', label: t('voucherNumber') },
          { key: 'item', label: t('item') },
          { key: 'quantity', label: t('quantity') },
          { key: 'price', label: t('price') },
          { key: 'project', label: t('project') },
          { key: 'date', label: t('date') },
          { key: 'actions', label: t('actions') },
        ]}
        data={filteredVouchers}
        emptyMessage={t('empty')}
        renderRow={(voucher) => (
          <tr key={voucher.id}>
            <td>{voucher.isImporting ? t('import') : t('export')}</td>
            <td>{voucher.voucherNumber}</td>
            <td>
              {voucher.item?.name || '-'}
              <div className="table-subline">{voucher.item?.itemCode || '-'}</div>
            </td>
            <td>{formatNumber(voucher.quantity, locale)}</td>
            <td>{formatNumber(voucher.price, locale)}</td>
            <td>{voucher.project?.name || '-'}</td>
            <td>{formatDate(voucher.createdAt, locale)}</td>
            <td>
              <Button variant="danger" className="btn-sm" onClick={() => handleDelete(voucher.id)}>
                {t('delete')}
              </Button>
            </td>
          </tr>
        )}
      />
    </Card>
  )
}
