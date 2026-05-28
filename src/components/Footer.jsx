import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CATEGORIES, WHATSAPP_NUMBER } from '../config'
import { buildWhatsappLink } from '../api'

export default function Footer() {
  const { t } = useTranslation()
  const phoneDisplay = '+216 29 200 623'

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <span className="brand"><span className="brand-mark">Iba</span>Chic</span>
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="footer-col">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            {CATEGORIES.map((cat) => (
              <li key={cat}><Link to={`/${cat}`}>{t(`nav.${cat}`)}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.contact')}</h4>
          <a
            className="footer-wa"
            href={buildWhatsappLink(t('footer.order'))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {phoneDisplay}
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} IbaChic — {t('footer.rights')}
      </div>
    </footer>
  )
}
