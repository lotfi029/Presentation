import { BrowserRouter } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { DataProvider } from './context/DataContext'
import { LanguageProvider } from './context/LanguageContext'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <DataProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </DataProvider>
      </NotificationProvider>
    </LanguageProvider>
  )
}

export default App
