import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const nav = useNavigate()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="brand text-2xl">College Thrift</Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm muted hover:text-gray-900">Browse</Link>
            <Link to="/items" className="text-sm muted hover:text-gray-900">Items</Link>
            <Link to="/about" className="text-sm muted hover:text-gray-900">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-1">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">{user.name?.[0] || 'U'}</div>
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs muted">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button title="Toggle theme" onClick={toggle} className="p-2 rounded-md bg-white/10 hover:bg-white/20">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </button>
                <Link to="/items/new" className="button">Sell Item</Link>
                <Link to="/requests/mine" className="button-secondary">My Requests</Link>
                <button className="button-secondary" onClick={()=>{ logout(); nav('/') }}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <button title="Toggle theme" onClick={toggle} className="p-2 rounded-md bg-white/10 hover:bg-white/20">{theme === 'dark' ? '🌙' : '☀️'}</button>
                <Link to="/login" className="text-sm muted">Login</Link>
                <Link to="/signup" className="button">Sign up</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
