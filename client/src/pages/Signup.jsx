import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { signup } = useAuth()
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      await signup({ name, email, password })
      nav('/')
    }catch(err){
      console.error('Signup failed', err?.response?.data || err.message)
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.response?.data || err.message
      setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg))
    }
  }

  return (
    <div className="container">
      <div className="card mx-auto max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
          <div className="flex justify-end">
            <button className="button" type="submit">Signup</button>
          </div>
        </form>
        {error && <div className="text-red-600 mt-3">{error}</div>}
      </div>
    </div>
  )
}
