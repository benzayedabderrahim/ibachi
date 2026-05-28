import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import { ADMIN_PATH, CATEGORIES } from './config'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Category from './pages/Category'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function StoreLayout() {
  return (
    <>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {CATEGORIES.map((cat) => (
            <Route key={cat} path={`/${cat}`} element={<Category category={cat} />} />
          ))}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        {/* Secret admin page — standalone, no public navigation. */}
        <Route path={ADMIN_PATH} element={<Admin />} />
        <Route path="/*" element={<StoreLayout />} />
      </Routes>
    </div>
  )
}
