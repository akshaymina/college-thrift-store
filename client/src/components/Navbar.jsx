import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Button from './Button'

export default function Navbar(){
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const nav = useNavigate()

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="container">
        <div className="glass flex items-center justify-between p-3 rounded-2xl hover:shadow-glow-md transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgba(124,58,237,0.18)] to-[rgba(6,182,212,0.06)] flex items-center justify-center text-white font-extrabold">CT</div>
              <div>
                <div className="text-lg font-semibold">College Thrift</div>
                <div className="text-xs muted">Campus Marketplace</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4 ml-4">
              <Link to="/" className="text-sm muted hover:text-white transition">Browse</Link>
              <Link to="/items" className="text-sm muted hover:text-white transition">Items</Link>
              <Link to="/about" className="text-sm muted hover:text-white transition">About</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button title="Toggle theme" onClick={toggle} className="p-2 rounded-md bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                <Button to="/items/new" variant="primary" size="sm">Sell</Button>
                <Button to="/requests/mine" variant="secondary" size="sm">Requests</Button>
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[rgba(255,255,255,0.03)]">
                  <div className="w-9 h-9 bg-[rgba(255,255,255,0.03)] rounded-lg flex items-center justify-center text-sm font-semibold">{user.name?.[0] || 'U'}</div>
                  <div className="text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs muted">{user.email}</div>
                  </div>
                  <Button onClick={()=>{ logout(); nav('/') }} variant="outline" size="sm">Logout</Button>
                </div>
                {/* duplicate block removed */}
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm muted hover:text-white transition">Login</Link>
                <Button to="/signup" variant="primary" size="sm">Sign up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
