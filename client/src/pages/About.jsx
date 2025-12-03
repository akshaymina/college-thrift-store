import React from 'react'

export default function About(){
  return (
    <div className="container">
      <div className="card max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">About College Thrift</h1>
        <p className="muted mb-4">A lightweight campus marketplace to buy and sell items between students. Built for speed, simplicity, and safety.</p>

        <div className="grid gap-4">
          <div className="glass p-4 rounded-lg">
            <h3 className="font-semibold">How it works</h3>
            <ol className="list-decimal list-inside text-sm mt-2 muted">
              <li>Browse listings from your campus.</li>
              <li>Send a buy request to the seller.</li>
              <li>Coordinate pickup and complete the sale.</li>
            </ol>
          </div>

          <div className="glass p-4 rounded-lg">
            <h3 className="font-semibold">Admins</h3>
            <p className="text-sm muted mt-2">Admins can manage users and items from the <strong>/admin</strong> dashboard. Admin credentials can be created using environment variables <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> when the server starts.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
