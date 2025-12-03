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
      <div className="mb-4">
        <form onSubmit={onSearch} className="flex gap-2">
          <input className="input flex-1" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items" />
          <button className="button">Search</button>
        </form>
      </div>

      {error && <div className="text-red-600 p-2 bg-red-50 rounded mb-3">{error}</div>}
      {loading ? <div className="p-4">Loading items...</div> : (
        <div className="grid">
          {items.length === 0 && <div className="card">No items found</div>}
          {items.map(item=> (
            <Link to={`/items/${item._id || item.id}`} key={item._id || item.id} className="card block">
              <div className="bg-gray-100 rounded-md mb-3 h-40 flex items-center justify-center overflow-hidden">
                {item.images && item.images.length>0 ? (
                  <img src={`${UPLOAD_BASE}${item.images[0]}`} alt={item.title} style={{maxHeight:'100%',maxWidth:'100%',objectFit:'cover'}} />
                ) : <div className="small">No Image</div>}
              </div>
              <div className="text-lg font-medium">{item.title}</div>
              <div className="small">{item.price ? `₹${item.price}` : 'Price not set'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
