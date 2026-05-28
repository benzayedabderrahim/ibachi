import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'

export default function Category({ category }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  return (
    <section className="section">
      <header className={`category-header header-${category}`}>
        <h1>{t(`categories.${category}.title`)}</h1>
        <p>{t(`categories.${category}.desc`)}</p>
      </header>
      <SearchBar value={query} onChange={setQuery} />
      <ProductGrid category={category} search={query} />
    </section>
  )
}
