import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Hero from '../components/Hero'
import CategoryTiles from '../components/CategoryTiles'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'

export default function Home() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  return (
    <>
      <Hero />

      <section className="section">
        <h2 className="section-title">{t('shopByCategory')}</h2>
        <CategoryTiles />
      </section>

      <section className="section">
        <h2 className="section-title">{query.trim() ? t('searchResults') : t('featured')}</h2>
        <SearchBar value={query} onChange={setQuery} />
        <ProductGrid limit={8} search={query} />
      </section>
    </>
  )
}
