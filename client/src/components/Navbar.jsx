import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="container flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-slate-900">College Thrift</Link>
        <Link to="/" className="text-sm text-slate-600">Browse</Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-slate-700">{user.name}</span>
            <Link to="/items/new" className="text-sm text-slate-600">Sell</Link>
            <Link to="/requests/mine" className="text-sm text-slate-600">My Requests</Link>
            <Link to="/requests/received" className="text-sm text-slate-600">Received</Link>
            <button className="button" onClick={()=>{ logout(); nav('/') }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-slate-700">Login</Link>
            <Link to="/signup" className="text-sm text-blue-600">Signup</Link>
          </>
        )}
      </div>
    </div>
  )
}
