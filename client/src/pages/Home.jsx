import React, { useEffect, useState } from 'react'
import api, { UPLOAD_BASE } from '../services/api'
import { Link } from 'react-router-dom'

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(()=>{
    fetchItems()
  },[])

  async function fetchItems(q=''){
    setLoading(true)
    setError(null)
    try{
      console.log('Fetching items from:', `${api.defaults.baseURL}/items`)
      const res = await api.get('/items', { params: { search: q, limit: 20 } })
      console.log('Items response:', res.data)
      // handle {items: Array} or {data: Array} or direct Array
      let data = res.data?.items || res.data?.data || res.data
      if(!Array.isArray(data)) data = []
      setItems(data)
    }catch(e){
      console.error('Failed to fetch items:', e)
      setError(e?.message || 'Failed to load items')
    }finally{setLoading(false)}
  }

  function onSearch(e){
    e.preventDefault()
    fetchItems(search)
  }

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={onSearch} className="flex gap-3 items-center">
          <input className="input flex-1" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items, category, campus..." />
          <button className="button">Search</button>
        </form>
      </div>

      {error && <div className="text-red-400 p-2 bg-[rgba(255,0,0,0.04)] rounded mb-3">{error}</div>}
      {loading ? <div className="p-6">Loading items...</div> : (
        <div className="grid">
          {items.length === 0 && <div className="card">No items found</div>}
          {items.map(item=> (
            <Link to={`/items/${item._id || item.id}`} key={item._id || item.id} className="card hover-raise block overflow-hidden">
              <div className="card-image relative h-48 rounded-md overflow-hidden mb-4">
                {item.images && item.images.length>0 ? (
                  <img src={`${UPLOAD_BASE}${item.images[0]}`} alt={item.title} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center small">No Image</div>}

                <div className="absolute top-3 left-3">
                  <span className="price-badge">₹{item.price || 'N/A'}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="glass-badge text-xs">{item.category || 'General'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold">{item.title}</div>
                  <div className="text-sm muted">{item.campus || 'Campus not set'}</div>
                </div>
                <div className="text-sm muted">{item.sellerName || item.seller?.name || ''}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
