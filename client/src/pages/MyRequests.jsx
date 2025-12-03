import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function MyRequests(){
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{ fetchRequests() },[])

  async function fetchRequests(){
    setLoading(true)
    setError(null)
    try{
      const res = await api.get('/requests/mine')
      console.log('My requests response:', res.data)
      // handle {data: Array} or direct array or {requests: Array}
      let items = res.data?.data || res.data?.requests || res.data
      if(!Array.isArray(items)) items = []
      setRequests(items)
    }catch(e){ 
      console.error('Failed to fetch my requests:', e?.response?.data || e.message)
      setError(e?.response?.data?.message || 'Failed to load requests')
    }finally{ setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Buy Requests</h2>
      {error && <div className="text-red-600 p-2 bg-red-50 rounded mb-3">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="grid">
          {requests.length===0 && <div className="card">No requests sent yet</div>}
          {Array.isArray(requests) && requests.map(r=> (
            <div key={r._id || r.id} className="card">
              <div className="text-lg font-medium">{r.item?.title || r.itemTitle}</div>
              <div className="small">Seller: {r.item?.seller?.name || r.seller?.email}</div>
              <div className="small">Status: <span className="font-medium capitalize">{r.status}</span></div>
              {r.message && <div className="text-sm mt-2">{r.message}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
