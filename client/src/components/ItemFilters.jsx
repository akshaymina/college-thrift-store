import React, { useState } from 'react'
import Button from './Button'

export default function ItemFilters({ onFilter, loading = false }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [campus, setCampus] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  function handleFilter() {
    onFilter({
      search: search.trim(),
      category,
      condition,
      minPrice,
      maxPrice,
      campus
    })
  }

  function handleReset() {
    setSearch('')
    setCategory('')
    setCondition('')
    setMinPrice('')
    setMaxPrice('')
    setCampus('')
    onFilter({
      search: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      campus: ''
    })
  }

  return (
    <div className="card mb-6">
      <div className="space-y-4">
        {/* Search bar */}
        <div className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
          />
          <Button onClick={handleFilter} disabled={loading}>🔍 Search</Button>
        </div>

        {/* Toggle advanced filters */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Filters
        </button>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            {/* Category */}
            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input w-full"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-medium block mb-2">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="input w-full"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="text-sm font-medium block mb-2">Min Price (₹)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input w-full"
                placeholder="0"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium block mb-2">Max Price (₹)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input w-full"
                placeholder="No limit"
              />
            </div>

            {/* Campus */}
            <div>
              <label className="text-sm font-medium block mb-2">Campus</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="input w-full"
              >
                <option value="">All Campuses</option>
                <option value="Main">Main Campus</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-end">
              <Button onClick={handleFilter} variant="primary" className="flex-1" disabled={loading}>
                {loading ? 'Filtering...' : 'Apply Filters'}
              </Button>
              <Button onClick={handleReset} variant="secondary" className="flex-1">
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
