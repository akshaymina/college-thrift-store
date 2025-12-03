import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      api.get('/auth/me').then(res=>{
        setUser(res.data.user)
      }).catch(()=>{
        localStorage.removeItem('token')
        setUser(null)
      }).finally(()=>setLoading(false))
    } else {
      setLoading(false)
    }
  },[])

  async function login(credentials){
    try{
      const res = await api.post('/auth/login', credentials)
      // support a few response shapes
      const token = res.data?.token || res.data?.data?.token || res.data?.accessToken
      const user = res.data?.user || res.data?.data?.user || res.data?.userData
      if(!token) throw new Error(res.data?.message || 'No token received')
      localStorage.setItem('token', token)
      setUser(user)
      return user
    }catch(err){
      console.error('Login error:', err?.response?.data || err.message)
      throw err
    }
  }

  async function signup(payload){
    try{
      const res = await api.post('/auth/signup', payload)
      const token = res.data?.token || res.data?.data?.token || res.data?.accessToken
      const user = res.data?.user || res.data?.data?.user || res.data?.userData
      if(!token) throw new Error(res.data?.message || 'No token received')
      localStorage.setItem('token', token)
      setUser(user)
      return user
    }catch(err){
      console.error('Signup error:', err?.response?.data || err.message)
      throw err
    }
  }

  function logout(){
    // best effort notify server
    api.post('/auth/logout').catch(()=>{})
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
