import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { createFeedback, fetchFeedbacks } from '../api'

const NAME_LIMIT = 20
const MESSAGE_LIMIT = 300
const DEVICE_KEY = 'iba_feedback_done'

export default function FeedbackSection() {
  const { t, i18n } = useTranslation()
  const [feedbacks, setFeedbacks] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // 'ok' | 'err' | null
  const [busy, setBusy] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(() => {
    try {
      return Boolean(localStorage.getItem(DEVICE_KEY))
    } catch {
      return false
    }
  })

  useEffect(() => {
    fetchFeedbacks()
      .then(setFeedbacks)
      .catch(() => setFeedbacks([]))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setBusy(true)
    setStatus(null)
    try {
      const created = await createFeedback(name.trim(), message.trim())
      setFeedbacks((prev) => [created, ...prev])
      setName('')
      setMessage('')
      setStatus('ok')
      try {
        localStorage.setItem(DEVICE_KEY, '1')
      } catch {
        /* ignore storage errors (private mode, etc.) */
      }
      setAlreadySubmitted(true)
    } catch {
      setStatus('err')
    } finally {
      setBusy(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return iso
    }
  }

  return (
    <section className="feedback-section">
      <div className="feedback-inner">
        <header className="feedback-head">
          <h2>{t('feedback.title')}</h2>
          <p>{t('feedback.subtitle')}</p>
        </header>

        <div className="feedback-layout">
          {/* Submission card — replaced by a thank-you card after one submission per session */}
          {alreadySubmitted ? (
            <div className="feedback-form feedback-thanks-card">
              <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 6L9 17l-5-5"
                />
              </svg>
              <h3>{t('feedback.alreadyTitle')}</h3>
              <p>{t('feedback.alreadyText')}</p>
            </div>
          ) : (
          <form className="feedback-form" onSubmit={submit}>
            <h3>{t('feedback.formTitle')}</h3>
            <label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('feedback.namePlaceholder')}
                maxLength={NAME_LIMIT}
                required
              />
            </label>
            <label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('feedback.messagePlaceholder')}
                maxLength={MESSAGE_LIMIT}
                rows={5}
                required
              />
              <span className="feedback-counter">
                {t('feedback.charsLeft', { n: MESSAGE_LIMIT - message.length })}
              </span>
            </label>
            {status === 'ok' && <p className="feedback-ok">{t('feedback.thanks')}</p>}
            {status === 'err' && <p className="feedback-err">{t('feedback.error')}</p>}
            <button type="submit" disabled={busy || !name.trim() || !message.trim()}>
              {busy ? t('feedback.sending') : t('feedback.submit')}
            </button>
          </form>
          )}

          {/* Reviews display */}
          <div className="feedback-grid">
            {feedbacks.length === 0 ? (
              <p className="feedback-empty">{t('feedback.empty')}</p>
            ) : (
              feedbacks.map((fb) => (
                <article key={fb.id} className="feedback-card">
                  <svg className="feedback-quote" viewBox="0 0 32 32" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M11.6 6.4c-3.7 1.4-6.4 5-6.4 9.2v9.6h9.6v-9.6H9.2c0-2.4 1.4-4.5 3.6-5.5l-1.2-3.7zm14.4 0c-3.7 1.4-6.4 5-6.4 9.2v9.6h9.6v-9.6h-5.6c0-2.4 1.4-4.5 3.6-5.5l-1.2-3.7z"
                    />
                  </svg>
                  <p className="feedback-text">{fb.description}</p>
                  <footer className="feedback-meta">
                    <span className="feedback-avatar" aria-hidden="true">
                      {(fb.name_user || '?').trim().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <strong>{fb.name_user}</strong>
                      <span className="feedback-date">{formatDate(fb.date)}</span>
                    </div>
                  </footer>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
