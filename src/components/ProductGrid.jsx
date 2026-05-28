import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchProducts } from '../api'
import ProductCard from './ProductCard'

export default function ProductGrid({ category, limit, search = '' }) {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    fetchProducts(category ? { category } : {})
      .then((data) => {
        if (!active) return
        setProducts(data)
        setStatus('done')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [category])

  const query = search.trim().toLowerCase()

  const visible = useMemo(() => {
    if (query) {
      return products.filter((p) =>
        [p.name, p.description, p.mat]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query)),
      )
    }
    return limit ? products.slice(0, limit) : products
  }, [products, query, limit])

  if (status === 'loading') return <p className="grid-message">{t('common.loading')}</p>
  if (status === 'error') return <p className="grid-message error">{t('common.error')}</p>
  if (products.length === 0) return <p className="grid-message">{t('common.empty')}</p>
  if (visible.length === 0) {
    return <p className="grid-message">{t('common.noResults', { query: search.trim() })}</p>
  }

  return (
    <div className="product-grid">
      {visible.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
