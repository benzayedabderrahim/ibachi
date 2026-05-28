import { useTranslation } from 'react-i18next'

import ProductGrid from '../components/ProductGrid'

export default function Category({ category }) {
  const { t } = useTranslation()

  return (
    <section className="section">
      <header className={`category-header header-${category}`}>
        <h1>{t(`categories.${category}.title`)}</h1>
        <p>{t(`categories.${category}.desc`)}</p>
      </header>
      <ProductGrid category={category} />
    </section>
  )
}
