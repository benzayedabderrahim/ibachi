import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({ src, alt, caption, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  // Render at the document body so no ancestor transform/overflow can clip the
  // full-screen overlay (cards use transform on hover, which would trap it).
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>×</button>
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </div>,
    document.body,
  )
}
