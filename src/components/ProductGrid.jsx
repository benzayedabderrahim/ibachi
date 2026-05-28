import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchProducts } from '../api'
import ProductCard from './ProductCard'

export default function ProductGrid({ category, limit }) {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    fetchProducts(category ? { category } : {})
      .then((data) => {
        if (!active) return
        setProducts(limit ? data.slice(0, limit) : data)
        setStatus('done')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [category, limit])

  if (status === 'loading') return <p className="grid-message">{t('common.loading')}</p>
  if (status === 'error') return <p className="grid-message error">{t('common.error')}</p>
  if (products.length === 0) return <p className="grid-message">{t('common.empty')}</p>

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
