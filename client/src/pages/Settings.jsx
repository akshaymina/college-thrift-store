import React, { useState } from 'react'
import api from '../services/api'

export default function Settings(){
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [saving, setSaving] = useState(false)
  const [pref, setPref] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('prefs')||'{}') }catch(e){return {}} })

  async function changePassword(e){
    e.preventDefault(); setSaving(true)
    try{
      await api.patch('/users/me/password', { currentPassword: current, newPassword: newPass })
      alert('Password updated')
      setCurrent(''); setNewPass('')
    }catch(e){ console.error(e); alert('Failed to change password') }
    finally{ setSaving(false) }
  }

  function toggle(k){ const next = {...pref, [k]: !pref[k] }; setPref(next); localStorage.setItem('prefs', JSON.stringify(next)) }

  return (
    <div className="container">
      <div className="card max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Settings</h2>

        <div className="glass p-4 rounded-lg">
          <h3 className="font-medium mb-2">Change Password</h3>
          <form onSubmit={changePassword} className="space-y-2">
            <input className="input" type="password" placeholder="Current password" value={current} onChange={e=>setCurrent(e.target.value)} />
            <input className="input" type="password" placeholder="New password" value={newPass} onChange={e=>setNewPass(e.target.value)} />
            <div className="flex justify-end">
              <button className="button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update password'}</button>
            </div>
          </form>
        </div>

        <div className="glass p-4 rounded-lg">
          <h3 className="font-medium mb-2">Notifications (demo)</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email alerts</div>
              <div className="text-xs muted">Receive email updates about requests</div>
            </div>
            <div>
              <button className={`px-3 py-1 rounded ${pref.email?'bg-[rgba(124,58,237,0.18)]':''}`} onClick={()=>toggle('email')}>{pref.email ? 'On' : 'Off'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
