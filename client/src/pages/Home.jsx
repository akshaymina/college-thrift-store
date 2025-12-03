import React, { useEffect, useState } from 'react'
import api, { UPLOAD_BASE } from '../services/api'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import ItemFilters from '../components/ItemFilters'

export default function Home(){
  const [items, setItems] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [error, setError] = useState(null)

  useEffect(()=>{
    fetchItems()
    fetchTrending()
  },[])

  async function fetchItems(filterParams = {}){
    setLoading(true)
    setError(null)
    try{
      const params = { limit: 20, ...filterParams }
      const res = await api.get('/items', { params })
      let data = res.data?.items || res.data?.data || res.data
      if(!Array.isArray(data)) data = []
      setItems(data)
    }catch(e){
      console.error('Failed to fetch items:', e)
      setError(e?.message || 'Failed to load items')
    }finally{setLoading(false)}
  }

  async function fetchTrending(){
    setTrendingLoading(true)
    try{
      const res = await api.get('/views/trending', { params: { limit: 6 } })
      setTrending(res.data?.items || [])
    }catch(e){
      console.error('Failed to fetch trending:', e)
    }finally{setTrendingLoading(false)}
  }

  function handleFilter(filterParams){
    setFilters(filterParams)
    fetchItems(filterParams)
  }

  return (
    <div>
      {/* Trending Section */}
      {trending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>
          {trendingLoading ? (
            <div className="p-4 text-center muted">Loading trending...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.slice(0, 6).map(item => (
                <Link to={`/items/${item._id}`} key={item._id} className="card hover-raise block overflow-hidden">
                  <div className="card-image relative h-40 rounded-md overflow-hidden mb-3">
                    {item.images && item.images.length > 0 ? (
                      <img src={`${UPLOAD_BASE}${item.images[0]}`} alt={item.title} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-xs muted">No Image</div>}
                    <div className="absolute top-2 left-2">
                      <span className="price-badge text-sm">₹{item.price}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold line-clamp-2">{item.title}</div>
                  <div className="text-xs muted">{item.totalViews} views</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <ItemFilters onFilter={handleFilter} loading={loading} />

      {/* Error message */}
      {error && <div className="text-red-400 p-2 bg-[rgba(255,0,0,0.04)] rounded mb-3">{error}</div>}

      {/* Items Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
        {loading ? (
          <div className="p-6 text-center">Loading items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length === 0 && <div className="card col-span-full text-center py-8">No items found</div>}
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
    </div>
  )
}
