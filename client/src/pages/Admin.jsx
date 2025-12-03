import React, { useEffect, useState } from 'react'
import api from '../services/api'

function UsersTab(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ fetchUsers() },[])
  async function fetchUsers(){ setLoading(true); try{ const res = await api.get('/admin/users'); setUsers(res.data.users||[])}catch(e){ console.error(e)}finally{setLoading(false)} }
  async function del(id){ if(!confirm('Delete user?')) return; await api.delete(`/admin/users/${id}`); fetchUsers() }

  if(loading) return <div className="p-6">Loading users...</div>
  return (
    <div className="space-y-3">
      {users.length===0 && <div className="card p-4">No users</div>}
      {users.map(u=> (
        <div key={u._id} className="card flex items-center justify-between">
          <div>
            <div className="font-medium">{u.name}</div>
            <div className="text-xs muted">{u.email} · {u.role}</div>
          </div>
          <div>
            <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={()=>del(u._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ItemsTab(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ fetchItems() },[])
  async function fetchItems(){ setLoading(true); try{ const res = await api.get('/admin/items'); setItems(res.data.items||[])}catch(e){ console.error(e)}finally{setLoading(false)} }
  async function del(id){ if(!confirm('Delete item?')) return; await api.delete(`/admin/items/${id}`); fetchItems() }

  if(loading) return <div className="p-6">Loading items...</div>
  return (
    <div className="space-y-3">
      {items.length===0 && <div className="card p-4">No items</div>}
      {items.map(i=> (
        <div key={i.id} className="card flex items-center justify-between">
          <div>
            <div className="font-medium">{i.title}</div>
            <div className="text-xs muted">{i.seller?.name || 'Unknown'} · {i.status}</div>
          </div>
          <div>
            <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={()=>del(i.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Admin(){
  const [tab, setTab] = useState('users')
  return (
    <div className="container">
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <div className="flex gap-2">
            <button onClick={()=>setTab('users')} className={`px-3 py-1 rounded ${tab==='users'?'bg-[rgba(124,58,237,0.15)]':''}`}>Users</button>
            <button onClick={()=>setTab('items')} className={`px-3 py-1 rounded ${tab==='items'?'bg-[rgba(124,58,237,0.15)]':''}`}>Items</button>
          </div>
        </div>
        {tab === 'users' ? <UsersTab /> : <ItemsTab />}
      </div>
    </div>
  )
}
