import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CATEGORIES } from '../config'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <Hero />

      <section className="section">
        <h2 className="section-title">{t('shopByCategory')}</h2>
        <div className="category-tiles">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/${cat}`} className={`category-tile tile-${cat}`}>
              <div className="tile-overlay">
                <h3>{t(`categories.${cat}.title`)}</h3>
                <p>{t(`categories.${cat}.desc`)}</p>
                <span className="tile-cta">{t('categories.explore')} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{t('featured')}</h2>
        <ProductGrid limit={8} />
      </section>
    </>
  )
}
