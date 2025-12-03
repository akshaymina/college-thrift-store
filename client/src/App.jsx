import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ItemDetail from './pages/ItemDetail'
import CreateItem from './pages/CreateItem'
import MyRequests from './pages/MyRequests'
import ReceivedRequests from './pages/ReceivedRequests'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div>
      <nav className="nav container">
        <Navbar />
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/items/new" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/requests/mine" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/requests/received" element={<ProtectedRoute><ReceivedRequests /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to='/' />} />
        </Routes>
      </main>
    </div>
  )
}
