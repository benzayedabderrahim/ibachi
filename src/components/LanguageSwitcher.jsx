import { useTranslation } from 'react-i18next'

import { LANGUAGES } from '../config'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.split('-')[0]

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LANGUAGES.map((lng) => (
        <button
          key={lng.code}
          type="button"
          className={current === lng.code ? 'active' : ''}
          onClick={() => i18n.changeLanguage(lng.code)}
        >
          {lng.label}
        </button>
      ))}
    </div>
  )
}
