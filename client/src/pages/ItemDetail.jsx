import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api, { UPLOAD_BASE } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'

export function Lightbox({ open, images, index, onClose }){
  if(!open) return null
  const img = images?.[index]
  if(!img) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <img src={`${UPLOAD_BASE}${img}`} alt="full" className="max-h-[90vh] max-w-[90vw] object-contain" />
    </div>
  )
}

export default function ItemDetail(){
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [pageError, setPageError] = useState(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const { user } = useAuth()

  useEffect(()=>{ fetchItem(); trackView() },[id])

  async function fetchItem(){
    setLoading(true)
    setPageError(null)
    try{
      const res = await api.get(`/items/${id}`)
      setItem(res.data.item || res.data)
      if(user){
        checkWishlist(id)
      }
    }catch(e){
      console.error('Failed to fetch item:', e)
      setPageError(e?.message || 'Failed to load item')
    }finally{ setLoading(false) }
  }

  async function trackView(){
    try{
      await api.post('/views/track', { itemId: id })
    }catch(e){
      console.error('Failed to track view:', e)
    }
  }

  async function checkWishlist(itemId){
    try{
      const res = await api.get(`/wishlist/check/${itemId}`)
      setInWishlist(res.data.inWishlist || false)
    }catch(e){
      console.error('Failed to check wishlist:', e)
    }
  }

  async function toggleWishlist(){
    if(!user){ alert('Login required'); return }
    setWishlistLoading(true)
    try{
      if(inWishlist){
        await api.delete(`/wishlist/${id}`)
        setInWishlist(false)
      } else {
        await api.post('/wishlist', { itemId: id })
        setInWishlist(true)
      }
    }catch(e){
      console.error('Failed to toggle wishlist:', e)
      alert('Failed to update wishlist')
    }finally{
      setWishlistLoading(false)
    }
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

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  if(loading) return <div className="p-4">Loading item...</div>
  if(pageError) return <div className="p-4 text-red-600">{pageError}</div>
  if(!item) return <div className="p-4">Item not found</div>

  return (
    <div>
      <div className="card-hero mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="md:w-1/3 w-full">
            {item.images && item.images.length>0 ? (
              <div>
                <div className="card-image overflow-hidden rounded-xl mb-3" style={{height:420}}>
                  <img onClick={() => { setPhotoIndex(0); setLightboxOpen(true) }} src={`${UPLOAD_BASE}${item.images[photoIndex] || item.images[0]}`} alt={item.title} className="w-full h-full object-contain cursor-zoom-in" />
                </div>
                <div className="flex gap-2">
                  {item.images.map((p,idx)=> (
                    <button key={idx} onClick={()=>setPhotoIndex(idx)} className={`w-16 h-12 rounded-md overflow-hidden border ${photoIndex===idx? 'border-[rgba(124,58,237,0.3)]' : 'border-[rgba(255,255,255,0.03)]'}`}>
                      <img src={`${UPLOAD_BASE}${p}`} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : <div className="h-72 bg-[rgba(255,255,255,0.02)] rounded-lg flex items-center justify-center"><span className="muted">No Image</span></div>}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
            <div className="flex items-center gap-3 mb-3">
              <span className="price-badge">₹{item.price || 'N/A'}</span>
              <div className="text-sm muted">{item.category || 'General'} • {item.condition || 'N/A'}</div>
            </div>
            <div className="text-sm muted mb-4">Campus: {item.campus || 'N/A'}</div>
            <div className="prose max-w-none mb-4">{item.description}</div>
            <div className="flex items-center gap-3 text-sm muted">
              <img src={item.seller?.avatarUrl || '/placeholder-avatar.png'} alt="seller" className="w-7 h-7 rounded-full object-cover" />
              <div>Seller: <span className="font-medium text-[--text]">{item.seller?.name || 'Unknown'}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => toggleWishlist()} disabled={wishlistLoading} variant={inWishlist ? "primary" : "secondary"}>
                {inWishlist ? '❤️ Saved' : '🤍 Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

        <div className="card">
        <h4 className="text-lg font-semibold">Send Buy Request</h4>
        {error && <div className="text-red-400 p-2 bg-[rgba(255,0,0,0.04)] rounded mt-2">{error}</div>}
        {success && <div className="text-green-400 p-2 bg-[rgba(0,255,128,0.04)] rounded mt-2">{success}</div>}
        <textarea className="input mt-3" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message to seller (optional)" rows={4} />
        <div className="mt-4 flex gap-3">
          <Button onClick={sendRequest}>Request to Buy</Button>
          <Button variant="secondary" onClick={()=>{ setMessage(''); setError(null); setSuccess(null); }}>Reset</Button>
        </div>
      </div>
        <Lightbox open={lightboxOpen} images={item.images || []} index={photoIndex} onClose={()=>setLightboxOpen(false)} />
    </div>
  )
  }
