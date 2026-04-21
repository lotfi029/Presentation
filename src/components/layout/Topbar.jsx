import { useLocation } from 'react-router-dom'
import Button from '../shared/Button'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'

const routeMeta = {
  '/': { title: 'dashboard', subtitle: 'dashboardSub' },
  '/voucher': { title: 'voucherForm', subtitle: 'voucherFormSub' },
  '/search': { title: 'searchVoucher', subtitle: 'searchVoucherSub' },
  '/vouchers': { title: 'allVouchers', subtitle: 'allVouchersSub' },
  '/items': { title: 'items', subtitle: 'itemsSub' },
  '/projects': { title: 'projects', subtitle: 'projectsSub' },
  '/units': { title: 'units', subtitle: 'unitsSub' },
  '/manufactures': { title: 'manufactures', subtitle: 'manufacturesSub' },
}

export default function Topbar() {
  const location = useLocation()
  const { refreshAll, loadingMap } = useData()
  const { t } = useLanguage()
  const meta = routeMeta[location.pathname] ?? routeMeta['/']

  return (
    <header className="topbar">
      <div>
        <h2 className="topbar-title">{t(meta.title)}</h2>
        <p className="topbar-subtitle">{t(meta.subtitle)}</p>
      </div>
      <div className="topbar-actions">
        <Button variant="ghost" onClick={() => refreshAll()}>
          {loadingMap.bootstrap ? t('loading') : t('refresh')}
        </Button>
      </div>
    </header>
  )
}
