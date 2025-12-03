import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Button from '../components/Button'

function ConfirmModal({ open, title, message, onConfirm, onCancel, loading = false, hasReason = false, onReasonChange = null }){
  const [reason, setReason] = useState('')
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="card max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm muted mb-3">{message}</p>
        {hasReason && (
          <input
            type="text"
            className="input mb-4 w-full"
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => { setReason(e.target.value); onReasonChange && onReasonChange(e.target.value); }}
          />
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={() => onConfirm(reason)} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function UsersTab(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmReason, setConfirmReason] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchUsers() }, [page])

  async function fetchUsers(){
    setLoading(true)
    try {
      const res = await api.get('/admin/users', { params: { page, pageSize: 10 } })
      setUsers(res.data.users || [])
      setPagination(res.data.pagination || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openDelete(user){
    setSelectedUser(user)
    setConfirmReason('')
    setConfirmOpen(true)
  }

  async function confirmDelete(reason){
    if (!selectedUser) return
    setDeleting(true)
    try {
      await api.delete(`/admin/users/${selectedUser._id}`, { data: { reason } })
      setConfirmOpen(false)
      fetchUsers()
    } catch (e) {
      console.error(e)
      alert('Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-6">Loading users...</div>
  return (
    <div className="space-y-3">
      {users.length === 0 && <div className="card p-4">No users</div>}
      {users.map(u => (
        <div key={u._id} className="card flex items-center justify-between">
          <div>
            <div className="font-medium">{u.name}</div>
            <div className="text-xs muted">{u.email} · {u.role}</div>
          </div>
          <Button variant="primary" size="sm" onClick={() => openDelete(u)}>Delete</Button>
        </div>
      ))}
      
      {pagination.pages && pagination.pages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Prev
          </Button>
          <span className="px-3 py-2 text-sm">Page {page} of {pagination.pages}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page >= pagination.pages}
          >
            Next →
          </Button>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete User?"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action will soft-delete the user and can be reversed.`}
        hasReason={true}
        onReasonChange={setConfirmReason}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  )
}

function ItemsTab(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [confirmReason, setConfirmReason] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchItems() }, [page])

  async function fetchItems(){
    setLoading(true)
    try {
      const res = await api.get('/admin/items', { params: { page, pageSize: 10 } })
      setItems(res.data.items || [])
      setPagination(res.data.pagination || {})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openDelete(item){
    setSelectedItem(item)
    setConfirmReason('')
    setConfirmOpen(true)
  }

  async function confirmDelete(reason){
    if (!selectedItem) return
    setDeleting(true)
    try {
      await api.delete(`/admin/items/${selectedItem.id}`, { data: { reason } })
      setConfirmOpen(false)
      fetchItems()
    } catch (e) {
      console.error(e)
      alert('Failed to delete item')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-6">Loading items...</div>
  return (
    <div className="space-y-3">
      {items.length === 0 && <div className="card p-4">No items</div>}
      {items.map(i => (
        <div key={i.id} className="card flex items-center justify-between">
          <div>
            <div className="font-medium">{i.title}</div>
            <div className="text-xs muted">{i.seller?.name || 'Unknown'} · {i.status}</div>
          </div>
          <Button variant="primary" size="sm" onClick={() => openDelete(i)}>Delete</Button>
        </div>
      ))}

      {pagination.pages && pagination.pages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Prev
          </Button>
          <span className="px-3 py-2 text-sm">Page {page} of {pagination.pages}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page >= pagination.pages}
          >
            Next →
          </Button>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Item?"
        message={`Are you sure you want to delete "${selectedItem?.title}"? This action will soft-delete the item and images will be removed. This can be reversed.`}
        hasReason={true}
        onReasonChange={setConfirmReason}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
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
            <button onClick={() => setTab('users')} className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-[rgba(124,58,237,0.15)]' : ''}`}>Users</button>
            <button onClick={() => setTab('items')} className={`px-3 py-1 rounded ${tab === 'items' ? 'bg-[rgba(124,58,237,0.15)]' : ''}`}>Items</button>
          </div>
        </div>
        {tab === 'users' ? <UsersTab /> : <ItemsTab />}
      </div>
    </div>
  )
}
