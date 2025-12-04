import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
// theme removed: fixed dark theme
import Button from './Button'
import Logo from '../512px-Mnit_logo.png'
import { UPLOAD_BASE } from '../services/api'

export default function Navbar(){
  const { user, logout } = useAuth()
  // no theme toggle; UI uses fixed dark theme
  const nav = useNavigate()
  const loc = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  // Track scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Detect active nav link
  const isActive = (path) => loc.pathname === path ? 'text-white' : 'muted'

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    nav('/')
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="glass border-b border-[rgba(255,255,255,0.06)] bg-[rgba(11,13,16,0.8)]">
        <div className="container max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-4 group">
            <img src={Logo} alt="MNIT Thrift Store" className="w-16 h-16 rounded-lg object-cover transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <div className="text-2xl font-bold leading-tight">MNIT Thrift Store</div>
              <div className="text-base opacity-60">Campus Marketplace</div>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link to="/" className={`text-base font-medium transition-colors ${isActive('/')}`}>
              Browse
            </Link>
            <Link to="/items" className={`text-base font-medium transition-colors ${isActive('/items')}`}>
              Items
            </Link>
            <Link to="/about" className={`text-base font-medium transition-colors ${isActive('/about')}`}>
              About
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle removed — fixed dark theme */}

            {user ? (
              <>
                {/* Action Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                  <Button to="/wishlist" variant="secondary" size="md">
                    ❤️ Wishlist
                  </Button>
                  <Button to="/items/new" variant="primary" size="md">
                    ✚ Sell
                  </Button>
                  <Button to="/requests/mine" variant="secondary" size="md">
                    📥 Requests
                  </Button>
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                    title={user.name}
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl.startsWith('/uploads') ? `${UPLOAD_BASE}${user.avatarUrl}` : user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgba(124,58,237,0.4)] to-[rgba(6,182,212,0.2)] flex items-center justify-center text-white text-base font-semibold">
                        {user.name?.[0] || 'U'}
                      </div>
                    )}
                    <span className="hidden sm:inline text-base font-medium">{user.name?.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 rounded-xl glass border border-[rgba(255,255,255,0.06)] shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.03)]">
                        <p className="text-base font-semibold">{user.name}</p>
                        <p className="text-sm muted">{user.email}</p>
                      </div>

                      <div className="py-3">
                        <Link 
                          to="/profile" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-5 py-3 text-base hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        >
                          👤 Profile
                        </Link>
                        <Link 
                          to="/wishlist" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-5 py-3 text-base hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        >
                          ❤️ Wishlist
                        </Link>
                        <Link 
                          to="/requests/received" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-5 py-3 text-base hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        >
                          📦 My Listings
                        </Link>
                        <a 
                          href="#" 
                          onClick={(e) => {e.preventDefault(); setDropdownOpen(false)}}
                          className="flex items-center gap-2 px-5 py-3 text-base hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        >
                          ⚙️ Settings
                        </a>
                      </div>

                      <div className="px-3 py-3 border-t border-[rgba(255,255,255,0.03)]">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-5 py-3 text-base text-red-400 hover:bg-[rgba(248,113,113,0.1)] rounded-lg transition-colors"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline text-base font-medium muted hover:text-white transition-colors">
                  Login
                </Link>
                <Button to="/signup" variant="primary" size="md">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
