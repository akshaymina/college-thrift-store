import React, { useEffect, useState } from 'react'
import api, { UPLOAD_BASE } from '../services/api'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function Wishlist(){
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [page, setPage] = useState(1)

  useEffect(() => { fetchWishlist() }, [page])

  async function fetchWishlist(){
    setLoading(true)
    try {
      const res = await api.get('/wishlist', { params: { page, pageSize: 10 } })
      setWishlist(res.data.wishlist || [])
      setPagination(res.data.pagination || {})
    } catch (e) {
      console.error('Failed to fetch wishlist:', e)
    } finally {
      setLoading(false)
    }
  }

  async function removeFromWishlist(itemId){
    try {
      await api.delete(`/wishlist/${itemId}`)
      fetchWishlist()
    } catch (e) {
      console.error('Failed to remove from wishlist:', e)
      alert('Failed to remove item')
    }
  }

  if (loading) return <div className="p-6">Loading wishlist...</div>

  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">❤️ My Wishlist</h1>
        <p className="text-sm muted mt-1">{pagination.total || 0} items saved</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <div className="text-lg font-medium">No saved items yet</div>
          <p className="text-sm muted mt-2">Start adding items to your wishlist!</p>
          <Link to="/">
            <Button className="mt-4">Browse Items</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {wishlist.map(wish => (
              <div key={wish.id} className="card hover-raise">
                <Link to={`/items/${wish.item._id}`} className="block">
                  <div className="card-image relative h-40 rounded-md overflow-hidden mb-3">
                    {wish.item.images && wish.item.images.length > 0 ? (
                      <img src={`${UPLOAD_BASE}${wish.item.images[0]}`} alt={wish.item.title} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-xs muted">No Image</div>}
                    <div className="absolute top-2 left-2">
                      <span className="price-badge">₹{wish.item.price}</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold line-clamp-2 mb-1">{wish.item.title}</div>
                  <div className="text-xs muted mb-2">{wish.item.category} • {wish.item.condition}</div>
                </Link>
                <div className="flex gap-2">
                  <Link to={`/items/${wish.item._id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">View</Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => removeFromWishlist(wish.item._id)}
                    className="w-full"
                  >
                    ❌ Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages && pagination.pages > 1 && (
            <div className="flex gap-2 justify-center mt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Button>
              <span className="px-3 py-2 text-sm">Page {page} of {pagination.pages}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page >= pagination.pages}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
