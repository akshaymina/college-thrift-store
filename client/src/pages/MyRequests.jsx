import React, { useEffect, useState } from 'react'
import api, { UPLOAD_BASE } from '../services/api'
import Button from '../components/Button'

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

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return 'bg-[rgba(74,222,128,0.1)] text-green-400 border border-[rgba(74,222,128,0.2)]'
      case 'rejected': return 'bg-[rgba(248,113,113,0.1)] text-red-400 border border-[rgba(248,113,113,0.2)]'
      case 'pending': return 'bg-[rgba(250,204,21,0.1)] text-yellow-400 border border-[rgba(250,204,21,0.2)]'
      default: return 'bg-[rgba(255,255,255,0.03)] text-[--muted] border border-[rgba(255,255,255,0.04)]'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Buy Requests</h1>
      <p className="text-[--muted] mb-6">Track all items you've requested to purchase</p>
      {error && <div className="text-red-400 p-3 bg-[rgba(248,113,113,0.1)] rounded-lg mb-4 border border-[rgba(248,113,113,0.2)]">{error}</div>}
      {loading ? <div className="text-center py-12 text-[--muted]">Loading requests...</div> : (
        <div>
          {requests.length===0 ? (
            <div className="card text-center py-12">
              <div className="text-[--muted] text-lg">No requests sent yet</div>
              <p className="text-sm muted mt-2">Browse items and send requests to sellers</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Array.isArray(requests) && requests.map(r=> (
                <div key={r._id || r.id} className="card p-4 hover-raise">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden card-image">
                      {r.itemId?.images && r.itemId.images.length > 0 ? (
                        <img src={`${UPLOAD_BASE}${r.itemId.images[0]}`} alt={r.itemId.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center muted">No Image</div>
                      )}
                    </div>

                    {/* Request Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{r.itemId?.title || r.itemTitle}</h3>
                          <p className="price-badge">₹{r.itemId?.price || 'N/A'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(r.status)}`}>
                          {r.status || 'Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-xs muted mb-1">Seller</p>
                          <p className="font-medium">{r.itemId?.sellerId?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-xs muted mb-1">Category</p>
                          <p className="font-medium">{r.itemId?.category || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs muted mb-1">Condition</p>
                          <p className="font-medium capitalize">{r.itemId?.condition || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs muted mb-1">Campus</p>
                          <p className="font-medium">{r.itemId?.campus || 'N/A'}</p>
                        </div>
                      </div>

                      {r.message && (
                        <div className="glass p-3 rounded-lg mb-3 border border-[rgba(255,255,255,0.04)]">
                          <p className="text-xs muted mb-1">Your message:</p>
                          <p className="text-sm italic">"{r.message}"</p>
                        </div>
                      )}

                      <p className="text-xs muted">
                        {new Date(r.createdAt).toLocaleDateString()} at {new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
