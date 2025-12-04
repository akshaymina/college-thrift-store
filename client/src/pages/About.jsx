import React from 'react'

export default function About(){
  return (
    <div className="py-8 md:py-12 space-y-8">
      {/* Hero Section */}
      <div className="card-hero text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">About College Thrift</h1>
        <p className="text-xl md:text-2xl muted leading-relaxed">A vibrant campus marketplace where students buy, sell, and exchange items. Built for speed, simplicity, and building community.</p>
      </div>

      {/* Mission Section */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg md:text-xl muted leading-relaxed mb-4">College Thrift makes it easy for students to find great deals on campus. Whether you're looking to declutter your dorm, find budget-friendly options, or make some extra cash, we provide a safe and simple platform for peer-to-peer transactions.</p>
        <p className="text-lg md:text-xl muted leading-relaxed">We believe in sustainability, affordability, and supporting the student community through seamless commerce.</p>
      </div>

      {/* How It Works */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
        <div className="grid gap-6">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔍</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-2">Browse & Discover</h3>
                <p className="text-lg muted leading-relaxed">Browse listings from students on your campus. Filter by category, price, and condition to find exactly what you need.</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💬</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-2">Send a Request</h3>
                <p className="text-lg muted leading-relaxed">Interested in an item? Send a buy request to the seller. It's a simple way to start a conversation about price, condition, and pickup details.</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🤝</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-2">Meet & Exchange</h3>
                <p className="text-lg muted leading-relaxed">Coordinate the details with the seller and arrange a safe meetup. Transactions happen directly between students on campus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose College Thrift?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">✨ Simple & Fast</h3>
            <p className="text-lg muted leading-relaxed">Minimal friction design. Post items in seconds, browse instantly, and connect with buyers or sellers immediately.</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">🛡️ Campus-Only</h3>
            <p className="text-lg muted leading-relaxed">Your marketplace is exclusive to your campus. Meet peers you recognize and build trust within your community.</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">💰 Better Prices</h3>
            <p className="text-lg muted leading-relaxed">Direct student-to-student pricing. No middlemen, no markups. Get the best deals on campus.</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">🌱 Sustainable</h3>
            <p className="text-lg muted leading-relaxed">Extend the life of goods, reduce waste, and promote a circular economy within your college community.</p>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Administration</h2>
        <div className="glass p-6 rounded-xl">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">👨‍💼 Admin Dashboard</h3>
          <p className="text-lg muted leading-relaxed mb-4">Administrators can manage users, moderate listings, and handle disputes from the admin dashboard.</p>
          <p className="text-lg muted leading-relaxed mb-4"><strong>Access:</strong> Navigate to <code className="bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded text-base md:text-lg">/admin</code> and log in with admin credentials.</p>
          <p className="text-lg muted leading-relaxed"><strong>Admin Setup:</strong> Admin credentials are configured using environment variables <code className="bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded text-base md:text-lg">ADMIN_EMAIL</code> and <code className="bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded text-base md:text-lg">ADMIN_PASSWORD</code> when the server starts.</p>
        </div>
      </div>

      {/* Contact/Footer */}
      <div className="card-hero text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Questions?</h2>
        <p className="text-xl md:text-2xl muted leading-relaxed mb-6">Have questions about buying or selling? Check out our help section or reach out to a campus admin.</p>
        <p className="text-lg muted leading-relaxed">Happy thrifting! 🎉</p>
      </div>
    </div>
  )
}
