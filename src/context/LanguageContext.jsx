import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './contexts'
import { translations } from '../utils/i18n'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('ims-language') || 'ar')

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    document.documentElement.dir = dir
    document.body.classList.toggle('ltr', dir === 'ltr')
    localStorage.setItem('ims-language', language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      direction: language === 'ar' ? 'rtl' : 'ltr',
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'ar' ? 'en' : 'ar')),
      t: (key) => translations[language][key] ?? key,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
