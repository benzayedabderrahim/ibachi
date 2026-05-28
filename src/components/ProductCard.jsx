import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { buildWhatsappLink } from '../api'
import Lightbox from './Lightbox'

export default function ProductCard({ product }) {
  const { t } = useTranslation()
  const [zoomed, setZoomed] = useState(false)

  const price = Number(product.price).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const baseMessage = t('product.whatsappMessage', {
    name: product.name,
    mat: product.mat,
    price,
  })

  // wa.me links cannot attach files, so we include the photo URL in the text;
  // WhatsApp renders a link preview when the image is publicly reachable.
  const message = product.image
    ? `${baseMessage}\n\n${t('product.photoLabel')}: ${product.image}`
    : baseMessage

  const soldOut = !product.dispo || product.stock === 0

  return (
    <article className="card">
      {product.image ? (
        <button
          type="button"
          className="card-media clickable"
          onClick={() => setZoomed(true)}
          aria-label={product.name}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
          <span className="card-zoom" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm4.5 10.5L20 20M10 7v6M7 10h6"
              />
            </svg>
          </span>
          {soldOut && <span className="card-badge">{t('product.unavailable')}</span>}
        </button>
      ) : (
        <div className="card-media">
          <div className="card-media-placeholder">IbaChic</div>
          {soldOut && <span className="card-badge">{t('product.unavailable')}</span>}
        </div>
      )}

      {zoomed && (
        <Lightbox
          src={product.image}
          alt={product.name}
          caption={product.name}
          onClose={() => setZoomed(false)}
        />
      )}

      <div className="card-body">
        <span className="card-ref">{t('product.reference')} {product.mat}</span>
        <h3 className="card-title">{product.name}</h3>
        {product.description && <p className="card-desc">{product.description}</p>}

        <div className="card-footer">
          <span className="card-price">
            {price} <small>{t('product.currency')}</small>
          </span>
          <a
            className="btn-whatsapp"
            href={buildWhatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={soldOut}
          >
            <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.5c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.9.9.9-4.7-.3-.4C5.4 18 5 16.5 5 15c0-6 4.9-10.9 11-10.9S27 9 27 15s-5 9.8-11 9.8zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6s-.7-1.8-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.1 2.2.9 3 1 4.1.9.7-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"
              />
            </svg>
            {t('product.order')}
          </a>
        </div>
      </div>
    </article>
  )
}
