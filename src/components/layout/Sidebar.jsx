import { NavLink } from 'react-router-dom'
import { FiBox, FiClipboard, FiFolder, FiGrid, FiSearch } from 'react-icons/fi'
import { useLanguage } from '../../hooks/useLanguage'

const navItems = [
  { to: '/', labelKey: 'dashboard', icon: <FiGrid />, end: true },
  { to: '/voucher', labelKey: 'voucherForm', icon: <FiClipboard /> },
  { to: '/search', labelKey: 'searchVoucher', icon: <FiSearch /> },
  { to: '/vouchers', labelKey: 'allVouchers', icon: <FiClipboard /> },
  { to: '/items', labelKey: 'items', icon: <FiBox /> },
  { to: '/projects', labelKey: 'projects', icon: <FiFolder /> },
]

export default function Sidebar() {
  const { t, toggleLanguage } = useLanguage()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">م</div>
        <h1>{t('appName')}</h1>
        <p>{t('appSub')}</p>
      </div>

      <nav className="nav-list">
        {navItems.map(({ to, labelKey, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {icon}
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <button className="lang-btn" onClick={toggleLanguage}>
        {t('language')}
      </button>
    </aside>
  )
}
