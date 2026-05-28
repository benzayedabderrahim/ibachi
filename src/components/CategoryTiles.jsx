import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { fetchProducts } from '../api'
import { CATEGORIES } from '../config'

function CategoryTile({ category, images, index }) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return undefined
    // Stagger each tile so they don't all change at the same instant.
    let interval
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        setActive((a) => (a + 1) % images.length)
      }, 3500)
    }, index * 900)
    return () => {
      clearTimeout(startDelay)
      clearInterval(interval)
    }
  }, [images.length, index])

  return (
    <Link to={`/${category}`} className={`category-tile tile-${category}`}>
      <div className="tile-slides">
        {images.map((src, i) => (
          <div
            key={src}
            className={`tile-slide ${i === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="tile-shade" />
      <div className="tile-overlay">
        <h3>{t(`categories.${category}.title`)}</h3>
        <p>{t(`categories.${category}.desc`)}</p>
        <span className="tile-cta">{t('categories.explore')} →</span>
      </div>
    </Link>
  )
}

export default function CategoryTiles() {
  const [byCategory, setByCategory] = useState({})

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        const map = {}
        for (const p of products) {
          if (!p.image) continue
          if (!map[p.category]) map[p.category] = []
          map[p.category].push(p.image)
        }
        setByCategory(map)
      })
      .catch(() => setByCategory({}))
  }, [])

  return (
    <div className="category-tiles">
      {CATEGORIES.map((cat, i) => (
        <CategoryTile key={cat} category={cat} images={byCategory[cat] || []} index={i} />
      ))}
    </div>
  )
}
