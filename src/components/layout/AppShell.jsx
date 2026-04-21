import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Dashboard from '../pages/Dashboard'
import VoucherPage from '../pages/VoucherPage'
import SearchVoucher from '../pages/SearchVoucher'
import AllVouchers from '../pages/AllVouchers'
import ItemsManagement from '../pages/ItemsManagement'
import ProjectsManagement from '../pages/ProjectsManagement'
import { useData } from '../../hooks/useData'
import { useLanguage } from '../../hooks/useLanguage'

export default function AppShell() {
  const { error } = useData()
  const { t } = useLanguage()

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <Topbar />
        <section className="page-content">
          {error ? <div className="inline-alert danger">{error.message || t('fetchError')}</div> : null}
          {import.meta.env.DEV && (
            <div className="api-hint">{t('apiBaseHint')}</div>
          )}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/voucher" element={<VoucherPage />} />
            <Route path="/search" element={<SearchVoucher />} />
            <Route path="/vouchers" element={<AllVouchers />} />
            <Route path="/items" element={<ItemsManagement />} />
            <Route path="/projects" element={<ProjectsManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  )
}
