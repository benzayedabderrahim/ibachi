import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CATEGORIES, SOCIAL_LINKS } from '../config'
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

          <h4 className="footer-follow-title">{t('footer.follow')}</h4>
          <div className="footer-social">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94z"
                />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M16.6 5.82a4.28 4.28 0 0 1-1.04-2.82h-3.1v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-.4-5.15v-3.16a5.7 5.7 0 0 0-.96-.08A5.71 5.71 0 1 0 14.22 15V9.01a7.35 7.35 0 0 0 4.29 1.37V7.28a4.28 4.28 0 0 1-1.91-1.46z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} IbaChic — {t('footer.rights')}
      </div>
    </footer>
  )
}
