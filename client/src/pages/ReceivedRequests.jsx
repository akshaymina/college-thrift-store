import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function ReceivedRequests(){
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{ fetchRequests() },[])

  async function fetchRequests(){
    setLoading(true)
    setError(null)
    try{
      const res = await api.get('/requests/received')
      console.log('Received requests response:', res.data)
      // handle {data: Array} or direct array or {requests: Array}
      let items = res.data?.data || res.data?.requests || res.data
      if(!Array.isArray(items)) items = []
      setRequests(items)
    }catch(e){ 
      console.error('Failed to fetch received requests:', e?.response?.data || e.message)
      setError(e?.response?.data?.message || 'Failed to load requests')
    }finally{ setLoading(false) }
  }

  async function respond(id, status){
    try{
      await api.patch(`/requests/${id}`, { status })
      fetchRequests()
    }catch(e){ alert('Failed to update') }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Requests Received</h2>
      {error && <div className="text-red-600 p-2 bg-red-50 rounded mb-3">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="grid">
          {requests.length===0 && <div className="card">No requests</div>}
          {Array.isArray(requests) && requests.map(r=> (
            <div key={r._id || r.id} className="card">
              <div className="text-lg font-medium">{r.item?.title || r.itemTitle}</div>
              <div className="small">From: {r.requester?.name || r.requesterEmail}</div>
              <div className="small">Status: {r.status}</div>
              <div className="mt-3 flex gap-2">
                <button className="button" onClick={()=>respond(r._id || r.id, 'accepted')}>Accept</button>
                <button className="px-3 py-2 rounded-md border" onClick={()=>respond(r._id || r.id, 'rejected')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
