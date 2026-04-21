import { useMemo } from 'react'
import Card from '../shared/Card'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import { formatDate, formatNumber } from '../../utils/formatters'

export default function Dashboard() {
  const { items, vouchers, projects, units, minimumNotifications, loadingMap } = useData()
  const { t, language } = useLanguage()
  const locale = language === 'ar' ? 'ar-EG' : 'en-US'
  const alerts = minimumNotifications

  const getVoucherTypeLabel = (voucher) => {
    const isImport =
      voucher.IsImport ?? voucher.isImport ?? voucher.isImporting ?? false

    return isImport ? t('import') : t('export')
  }

  const recentVouchers = useMemo(
    () =>
      [...vouchers].sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      ),
    [vouchers],
  )

  return (
    <div className="page-stack">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">{t('itemsCount')}</span>
          <strong className="stat-value">{formatNumber(items.length, locale)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('vouchersCount')}</span>
          <strong className="stat-value">{formatNumber(vouchers.length, locale)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('projectsCount')}</span>
          <strong className="stat-value">{formatNumber(projects.length, locale)}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t('unitsCount')}</span>
          <strong className="stat-value">{formatNumber(units.length, locale)}</strong>
        </div>
      </div>

      <div className="content-grid">
        <Card title={t('recentVouchers')}>
          {loadingMap.bootstrap ? (
            <p className="muted">{t('loading')}</p>
          ) : recentVouchers.length ? (
            <div className="list-stack">
              {recentVouchers.slice(0, 5).map((voucher) => (
                <div key={voucher.id} className="list-row">
                  <div>
                    <strong>{voucher.voucherNumber}</strong>
                    <div className="muted">
                      {getVoucherTypeLabel(voucher)} •{' '}
                      {voucher.item?.name || '-'} • {voucher.project?.name || '-'}
                    </div>
                  </div>
                  <span>{formatDate(voucher.createdAt, locale)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">{t('empty')}</p>
          )}
        </Card>

        <Card title={t('lowStock')}>
          {loadingMap.bootstrap || loadingMap.minimumNotifications ? (
            <p className="muted">{t('loading')}</p>
          ) : alerts.length ? (
            <div className="list-stack">
              {alerts.map((item) => (
                <div key={item.id} className="alert danger">
                  <strong>{item.name}</strong>
                  <span>
                    {formatNumber(item.quantity, locale)} / {formatNumber(item.minQuantity, locale)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">{t('empty')}</p>
          )}
        </Card>
      </div>
    </div>
  )
}
