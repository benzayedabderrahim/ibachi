import { useCallback, useEffect, useRef, useState } from 'react'

import {
  adminLogin,
  clearToken,
  createProduct,
  deleteProduct,
  fetchProducts,
  getToken,
  updateProduct,
} from '../api'
import { CATEGORIES } from '../config'

const CATEGORY_LABELS = {
  women: 'Femmes',
  men: 'Hommes',
  kids: 'Enfants',
  accessories: 'Accessoires',
}

const EMPTY_FORM = {
  name: '',
  category: 'women',
  price: '',
  stock: '',
  description: '',
  dispo: true,
}

function formFrom(product) {
  if (!product) return EMPTY_FORM
  return {
    name: product.name || '',
    category: product.category || 'women',
    price: product.price ?? '',
    stock: product.stock ?? '',
    description: product.description || '',
    dispo: Boolean(product.dispo),
  }
}

function LoginScreen({ onLoggedIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await adminLogin(username, password)
      onLoggedIn()
    } catch {
      setError('Identifiants invalides.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-card" onSubmit={submit}>
        <h1 className="admin-brand"><span>Iba</span>Chic</h1>
        <p className="admin-sub">Espace de gestion</p>
        <label>
          Identifiant
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Connexion...' : 'Se connecter'}</button>
      </form>
    </div>
  )
}

function ProductForm({ editing, onDone, onCancel }) {
  const isEdit = Boolean(editing)
  const [form, setForm] = useState(formFrom(editing))
  const [imageFile, setImageFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setForm(formFrom(editing))
    setImageFile(null)
    setMessage(null)
  }, [editing])

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    const fields = {
      name: form.name,
      category: form.category,
      price: form.price || 0,
      stock: form.stock || 0,
      description: form.description,
      dispo: form.dispo,
    }
    try {
      if (isEdit) {
        const saved = await updateProduct(editing.id, fields, imageFile)
        setMessage({ type: 'ok', text: `Produit modifié — réf. ${saved.mat}` })
        onDone()
      } else {
        const created = await createProduct(fields, imageFile)
        setMessage({ type: 'ok', text: `Produit "${form.name}" ajouté — réf. ${created.mat}` })
        setForm(EMPTY_FORM)
        setImageFile(null)
        e.target.reset()
        onDone()
      }
    } catch (err) {
      const data = err?.response?.data
      const text =
        data && typeof data === 'object'
          ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' · ')
          : 'Échec de l’enregistrement du produit.'
      setMessage({ type: 'err', text })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-head">
        <h2>{isEdit ? `Modifier — ${editing.mat}` : 'Ajouter un produit'}</h2>
        {isEdit && (
          <button type="button" className="admin-cancel" onClick={onCancel}>Annuler</button>
        )}
      </div>
      {!isEdit && (
        <p className="admin-hint">
          La référence (matricule) est générée automatiquement à partir de la catégorie et du nom.
        </p>
      )}
      <div className="admin-grid">
        <label>
          Nom*
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label>
          Catégorie*
          <select value={form.category} onChange={update('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </label>
        <label>
          Prix (TND)*
          <input type="number" step="0.01" min="0" value={form.price} onChange={update('price')} required />
        </label>
        <label>
          Stock
          <input type="number" min="0" value={form.stock} onChange={update('stock')} />
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.dispo} onChange={update('dispo')} />
          Disponible
        </label>
        <label className="admin-full">
          Description
          <textarea rows="3" value={form.description} onChange={update('description')} />
        </label>
        <label className="admin-full">
          Image {isEdit && <span className="admin-note">(laisser vide pour garder la photo actuelle)</span>}
          <input
            key={editing?.id || 'new'}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </label>
        {isEdit && editing.image && !imageFile && (
          <img className="admin-current-img" src={editing.image} alt={editing.name} />
        )}
      </div>
      {message && <p className={message.type === 'ok' ? 'admin-ok' : 'admin-error'}>{message.text}</p>}
      <button type="submit" disabled={busy}>
        {busy ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Ajouter le produit'}
      </button>
    </form>
  )
}

function ProductCards({ products, onEdit, onDelete }) {
  return (
    <div className="admin-list">
      <h2>Produits existants ({products.length})</h2>
      <div className="admin-products">
        {products.map((p) => (
          <div className="admin-product" key={p.id}>
            <div className="admin-product-thumb">
              {p.image ? (
                <img src={p.image} alt={p.name} loading="lazy" />
              ) : (
                <span className="admin-product-noimg">IbaChic</span>
              )}
              {!p.dispo && <span className="admin-product-badge">Indisponible</span>}
            </div>
            <div className="admin-product-info">
              <span className="admin-product-ref">{p.mat}</span>
              <strong>{p.name}</strong>
              <span className="admin-product-meta">
                {CATEGORY_LABELS[p.category] || p.category} · {Number(p.price).toFixed(2)} TND · stock {p.stock}
              </span>
            </div>
            <div className="admin-product-actions">
              <button className="admin-edit" onClick={() => onEdit(p)}>Modifier</button>
              <button className="admin-del" onClick={() => onDelete(p)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()))
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const formRef = useRef(null)

  const loadProducts = useCallback(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    if (authed) loadProducts()
  }, [authed, loadProducts])

  const logout = () => {
    clearToken()
    setAuthed(false)
  }

  const handleEdit = (product) => {
    setEditing(product)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSaved = () => {
    loadProducts()
    setEditing(null)
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer "${product.name}" ?`)) return
    try {
      await deleteProduct(product.id)
      if (editing?.id === product.id) setEditing(null)
      loadProducts()
    } catch {
      alert('Suppression impossible (session expirée ?). Reconnectez-vous.')
    }
  }

  if (!authed) return <LoginScreen onLoggedIn={() => setAuthed(true)} />

  return (
    <div className="admin-page">
      <header className="admin-header">
        <span className="admin-brand-sm"><span>Iba</span>Chic — Gestion</span>
        <button className="admin-logout" onClick={logout}>Déconnexion</button>
      </header>
      <div className="admin-body">
        <div ref={formRef}>
          <ProductForm editing={editing} onDone={handleSaved} onCancel={() => setEditing(null)} />
        </div>
        <ProductCards products={products} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  )
}
