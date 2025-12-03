import React, { useEffect, useState } from 'react'
import api, { UPLOAD_BASE } from '../services/api'

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
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Buy Requests</h1>
      {error && <div className="text-red-600 p-3 bg-red-50 rounded mb-4">{error}</div>}
      {loading ? <div className="text-center py-8">Loading requests...</div> : (
        <div>
          {requests.length===0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400 text-lg">No requests sent yet</div>
              <p className="text-sm text-gray-500 mt-2">Browse items and send requests to sellers</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(requests) && requests.map(r=> (
                <div key={r._id || r.id} className="card p-4 border border-gray-200 hover:shadow-md transition">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {r.itemId?.images && r.itemId.images.length > 0 ? (
                        <img src={`${UPLOAD_BASE}${r.itemId.images[0]}`} alt={r.itemId.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                      )}
                    </div>

                    {/* Request Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{r.itemId?.title || r.itemTitle}</h3>
                          <p className="text-sm text-gray-600">₹{r.itemId?.price || 'N/A'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(r.status)}`}>
                          {r.status || 'Pending'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                        <div>
                          <p className="text-gray-500">Seller</p>
                          <p className="font-medium text-gray-900">{r.itemId?.sellerId?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Category</p>
                          <p className="font-medium text-gray-900">{r.itemId?.category || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Condition</p>
                          <p className="font-medium text-gray-900 capitalize">{r.itemId?.condition || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Campus</p>
                          <p className="font-medium text-gray-900">{r.itemId?.campus || 'N/A'}</p>
                        </div>
                      </div>

                      {r.message && (
                        <div className="bg-gray-50 p-2 rounded mt-2 border-l-2 border-blue-500">
                          <p className="text-xs text-gray-600">Your message:</p>
                          <p className="text-sm text-gray-800 italic">"{r.message}"</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
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
