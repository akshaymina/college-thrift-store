import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Profile(){
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{ fetchProfile() },[])
  async function fetchProfile(){ setLoading(true); try{ const res = await api.get('/users/me'); setProfile(res.data.user); setName(res.data.user?.name||'') }catch(e){console.error(e)}finally{setLoading(false)} }

  function onFile(e){ setAvatar(e.target.files?.[0] || null) }

  async function save(e){
    e.preventDefault(); setSaving(true)
    try{
      const form = new FormData()
      if(name) form.append('name', name)
      if(avatar) form.append('avatar', avatar)
      const res = await api.patch('/users/me', form, { headers: {'Content-Type':'multipart/form-data'} })
      await refreshUser()
      setProfile(res.data.user)
      alert('Profile updated')
    }catch(err){ console.error(err); alert('Failed to save') }
    finally{ setSaving(false) }
  }

  if(loading) return <div className="p-6">Loading profile...</div>

  return (
    <div className="container">
      <div className="card max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">My Profile</h2>
        <div className="flex gap-6 items-center mb-4">
          <div>
            <img src={profile?.avatarUrl || '/placeholder-avatar.png'} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
          </div>
          <div>
            <div className="text-lg font-medium">{profile?.name}</div>
            <div className="text-xs muted">{profile?.email}</div>
          </div>
        </div>

        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm mb-1 block">Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm mb-1 block">Avatar</label>
            <input type="file" accept="image/*" onChange={onFile} />
          </div>

          <div className="flex justify-end">
            <button className="button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
