import { useMemo, useState } from 'react'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'
import Card from '../shared/Card'
import { formatDate, formatNumber } from '../../utils/formatters'

export default function SearchVoucher() {
  const { vouchers } = useData()
  const { t, language } = useLanguage()
  const [query, setQuery] = useState('')
  const locale = language === 'ar' ? 'ar-EG' : 'en-US'

  const getVoucherTypeLabel = (voucher) => {
    const isImport =
      voucher.IsImport ?? voucher.isImport ?? voucher.isImporting ?? false

    return isImport ? t('import') : t('export')
  }

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []

    return vouchers.filter((voucher) => {
      const haystack = [
        voucher.voucherNumber,
        voucher.item?.name,
        voucher.item?.itemCode,
        voucher.project?.name,
        getVoucherTypeLabel(voucher),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
  }, [query, t, vouchers])

  return (
    <Card title={t('searchVoucher')} subtitle={t('searchVoucherSub')}>
      <div className="search-panel">
        <input
          className="form-control"
          placeholder={t('search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {query && !results.length ? <p className="muted">{t('noResults')}</p> : null}

      <div className="list-stack">
        {results.map((voucher) => (
          <article key={voucher.id} className="voucher-card">
            <div className="voucher-card-header">
              <div>
                <strong>{voucher.voucherNumber}</strong>
                <div className="muted">{getVoucherTypeLabel(voucher)}</div>
              </div>
              <span>{formatDate(voucher.createdAt, locale)}</span>
            </div>
            <div className="voucher-card-grid">
              <div>
                <label>{t('item')}</label>
                <div>{voucher.item?.name || '-'}</div>
              </div>
              <div>
                <label>{t('itemCode')}</label>
                <div>{voucher.item?.itemCode || '-'}</div>
              </div>
              <div>
                <label>{t('quantity')}</label>
                <div>{formatNumber(voucher.quantity, locale)}</div>
              </div>
              <div>
                <label>{t('price')}</label>
                <div>{formatNumber(voucher.price, locale)}</div>
              </div>
              <div>
                <label>{t('unit')}</label>
                <div>{voucher.unit?.name || '-'}</div>
              </div>
              <div>
                <label>{t('manufacture')}</label>
                <div>{voucher.manufacture?.name || voucher.manufacturer?.name || '-'}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  )
}
