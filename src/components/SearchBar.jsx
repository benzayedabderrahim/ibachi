import { useTranslation } from 'react-i18next'

export default function SearchBar({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="search-bar">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M10 4a6 6 0 100 12 6 6 0 000-12zm4.5 10.5L20 20"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('common.searchPlaceholder')}
        aria-label={t('common.searchPlaceholder')}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Clear" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  )
}
