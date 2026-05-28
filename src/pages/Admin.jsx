import { useCallback, useEffect, useState } from 'react'

import {
  adminLogin,
  clearToken,
  createProduct,
  deleteProduct,
  fetchProducts,
  getToken,
} from '../api'
import { CATEGORIES } from '../config'

const CATEGORY_LABELS = {
  women: 'Femmes',
  men: 'Hommes',
  kids: 'Enfants',
  accessories: 'Accessoires',
}

const EMPTY_FORM = {
  mat: '',
  name: '',
  category: 'women',
  price: '',
  stock: '',
  description: '',
  dispo: true,
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

function ProductForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      await createProduct(
        {
          mat: form.mat,
          name: form.name,
          category: form.category,
          price: form.price || 0,
          stock: form.stock || 0,
          description: form.description,
          dispo: form.dispo,
        },
        imageFile,
      )
      setMessage({ type: 'ok', text: `Produit "${form.name}" ajouté.` })
      setForm(EMPTY_FORM)
      setImageFile(null)
      e.target.reset()
      onCreated()
    } catch (err) {
      const data = err?.response?.data
      const text =
        data && typeof data === 'object'
          ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' · ')
          : "Échec de l'ajout du produit."
      setMessage({ type: 'err', text })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <h2>Ajouter un produit</h2>
      <div className="admin-grid">
        <label>
          Matricule (réf.)*
          <input value={form.mat} onChange={update('mat')} required />
        </label>
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
          Image
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)} />
        </label>
      </div>
      {message && <p className={message.type === 'ok' ? 'admin-ok' : 'admin-error'}>{message.text}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Ajout...' : 'Ajouter le produit'}</button>
    </form>
  )
}

function ProductList({ products, onDelete }) {
  return (
    <div className="admin-list">
      <h2>Produits existants ({products.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Réf.</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.mat}</td>
              <td>{p.name}</td>
              <td>{CATEGORY_LABELS[p.category] || p.category}</td>
              <td>{Number(p.price).toFixed(2)} TND</td>
              <td>{p.stock}</td>
              <td>
                <button className="admin-del" onClick={() => onDelete(p)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()))
  const [products, setProducts] = useState([])

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

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer "${product.name}" ?`)) return
    try {
      await deleteProduct(product.id)
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
        <ProductForm onCreated={loadProducts} />
        <ProductList products={products} onDelete={handleDelete} />
      </div>
    </div>
  )
}
