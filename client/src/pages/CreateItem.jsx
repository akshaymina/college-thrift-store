import React, { useState } from 'react'
import api, { API_BASE } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function CreateItem(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('good')
  const [campus, setCampus] = useState('')
  const [images, setImages] = useState([])
  const [preview, setPreview] = useState([])
  const [error, setError] = useState(null)
  const nav = useNavigate()

  function onFiles(e){
    const files = Array.from(e.target.files)
    setImages(files)
    setPreview(files.map(f=>URL.createObjectURL(f)))
  }

  async function onSubmit(e){
    e.preventDefault()
    setError(null)
    
    // client-side validation
    if(!title.trim() || !price || !category.trim()){
      setError('Title, Price, and Category are required')
      return
    }
    
    if(isNaN(parseFloat(price)) || parseFloat(price) < 0){
      setError('Price must be a valid number >= 0')
      return
    }
    
    if(category.trim().length < 2){
      setError('Category must be at least 2 characters')
      return
    }
    
    if(title.trim().length < 3){
      setError('Title must be at least 3 characters')
      return
    }
    
    const form = new FormData()
    form.append('title', title)
    form.append('description', description)
    form.append('price', parseFloat(price))
    form.append('category', category)
    form.append('condition', condition)
    form.append('campus', campus || 'Main')
    images.forEach(file=> form.append('images', file))

    try{
      const res = await api.post('/items', form, { headers: {'Content-Type':'multipart/form-data'} })
      nav(`/items/${res.data.item?._id || res.data._id || res.data.id}`)
    }catch(e){
      console.error('Create item error:', e?.response?.data)
      const errData = e?.response?.data
      // handle both validation errors and simple error messages
      if(Array.isArray(errData?.errors)){
        setError(errData.errors.map((err) => `${err.path}: ${err.msg || err.message}`).join('; '))
      }else if(errData?.message){
        setError(errData.message)
      }else if(errData?.error){
        setError(errData.error)
      }else{
        setError('Failed to create item. Check console for details.')
      }
    }
  }

  return (
    <div className="container">
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">List an Item</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (min 3 chars)" />
            <div className="text-xs text-gray-500 mt-1">Required</div>
          </div>
          <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" />
          <div>
            <input className="input" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" step="0.01" min="0" />
            <div className="text-xs text-gray-500 mt-1">Required, must be a number ≥ 0</div>
          </div>
          <div>
            <input className="input" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category (min 2 chars)" />
            <div className="text-xs text-gray-500 mt-1">Required. E.g., Books, Electronics, Furniture</div>
          </div>
          <div>
            <select className="input" value={condition} onChange={e=>setCondition(e.target.value)}>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">Condition (optional)</div>
          </div>
          <input className="input" value={campus} onChange={e=>setCampus(e.target.value)} placeholder="Campus (optional, default: Main)" />
          <div>
            <label className="block text-sm font-medium mb-1">Upload Images</label>
            <input type="file" multiple onChange={onFiles} className="block text-sm" />
          </div>
          <div className="flex gap-2">
            {preview.map((p,idx)=> <img key={idx} src={p} alt="preview" className="h-20 rounded-md" />)}
          </div>
          <div className="flex justify-end">
            <button className="button" type="submit">Create</button>
          </div>
        </form>
        {error && <div className="text-red-600 mt-3 p-2 bg-red-50 rounded">{error}</div>}
      </div>
    </div>
  )
}
