import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-eyebrow">IbaChic</span>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <Link to="/women" className="btn-primary">{t('hero.cta')}</Link>
      </div>
    </section>
  )
}
