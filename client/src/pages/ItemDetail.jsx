import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api, { UPLOAD_BASE } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function ItemDetail(){
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [pageError, setPageError] = useState(null)
  const { user } = useAuth()

  useEffect(()=>{ fetchItem() },[id])

  async function fetchItem(){
    setLoading(true)
    setPageError(null)
    try{
      console.log('Fetching item:', id)
      const res = await api.get(`/items/${id}`)
      console.log('Item response:', res.data)
      setItem(res.data.item || res.data)
    }catch(e){
      console.error('Failed to fetch item:', e)
      setPageError(e?.message || 'Failed to load item')
    }finally{ setLoading(false) }
  }

  async function sendRequest(){
    if(!user){ alert('Login required'); return }
    setError(null)
    setSuccess(null)
    try{
      await api.post(`/items/${id}/requests`, { message })
      setSuccess('Request sent successfully!')
      setMessage('')
      setTimeout(()=>setSuccess(null), 3000)
    }catch(e){
      console.error('Send request error:', e?.response?.data)
      const errMsg = e?.response?.data?.message || e?.response?.data?.error || 'Failed to send request'
      setError(errMsg)
    }
  }

  if(loading) return <div className="p-4">Loading item...</div>
  if(pageError) return <div className="p-4 text-red-600">{pageError}</div>
  if(!item) return <div className="p-4">Item not found</div>

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold">{item.title}</h2>
      <div className="mt-4 flex flex-col md:flex-row gap-6">
        <div className="md:w-72 w-full">
          {item.images && item.images.length>0 ? (
            <img src={`${UPLOAD_BASE}${item.images[0]}`} alt={item.title} className="w-full rounded-md object-cover" style={{height:'400px'}} />
          ) : <div className="h-96 bg-gray-100 rounded-md flex items-center justify-center"><span className="text-gray-400">No Image</span></div>}
        </div>
        <div className="flex-1">
          <div className="small">Price: {item.price ? `₹${item.price}` : 'N/A'}</div>
          <div className="small">Campus: {item.campus}</div>
          <div className="mt-3">{item.description}</div>

          <div className="mt-6">
            <h4 className="font-medium">Send Buy Request</h4>
            {error && <div className="text-red-600 p-2 bg-red-50 rounded mt-2">{error}</div>}
            {success && <div className="text-green-600 p-2 bg-green-50 rounded mt-2">{success}</div>}
            <textarea className="input mt-2" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message to seller (optional)" />
            <div className="mt-3">
              <button className="button" onClick={sendRequest}>Request to Buy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
