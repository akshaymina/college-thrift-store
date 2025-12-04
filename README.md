# 🎓 MNIT Thrift Store

> A vibrant campus marketplace where MNIT students buy, sell, and exchange items securely within the college community.

MNIT Thrift Store is a modern, full-stack web application designed to foster sustainable shopping and peer-to-peer commerce among students. With a sleek, dark-themed interface and powerful admin tools, it makes campus trading fast, safe, and fun.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📦 **Item Marketplace** | Browse, list, and search for items from campus peers |
| 💬 **Smart Requests** | Send buy requests directly to sellers and negotiate |
| ❤️ **Wishlist** | Save favorite items for later |
| 👤 **User Profiles** | Manage listings, requests, and account settings |
| 🛡️ **Admin Dashboard** | Powerful admin tools to manage users, items, and disputes |
| 🔐 **Secure Auth** | JWT-based authentication with role-based access control |
| 🎨 **Premium UI** | Responsive, accessible, dark-modern design (desktop-first) |
| 🗂️ **Image Uploads** | Seamless item photo uploads |

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite (fast, modern bundler)
- TailwindCSS (utility-first styling)
- React Router v6 (client-side routing)
- Axios (HTTP client)

**Backend:**
- Node.js + Express (REST API)
- MongoDB (NoSQL database)
- JWT (authentication)
- bcrypt (password hashing)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **MongoDB** (local or cloud, e.g., MongoDB Atlas) (Optional for now)
- **Git**

---

## 🚀 Getting Started (How to run)

### Step 1: Clone the Repository

```bash
git clone https://github.com/akshaymina/college-thrift-store.git
cd college-thrift-store
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection (local or cloud)
MONGO_URI=mongodb+srv://storeAdmin:Lr60jGwWlDkMH2oY@thriftcluster.ux3vjpx.mongodb.net/?appName=thriftCluster

# JWT Configuration
JWT_SECRET=bajra_ki_roti
JWT_EXPIRES_IN=1d

# CORS & Security
CORS_ORIGIN=http://localhost:5173
COOKIE_SECURE=false

# Admin Account (auto-created on first run)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPass123
```

> 💡 **Tip:** The admin account will be automatically created in MongoDB when the server starts.

### Step 4: Launch Development Servers

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
```
> API runs at: [http://localhost:5000/api](http://localhost:5000/api)

**Terminal 2 — Frontend (new terminal):**
```bash
cd client
npm run dev
```
> App runs at: [http://localhost:5173](http://localhost:5173)

✅ You're ready! Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build for Production

To create a production-ready bundle:

```bash
cd client
npm run build
```

Output files will be in `client/dist/`, ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

---

## 📁 Project Structure

```
college-thrift-store/
├── client/                 # React frontend (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── contexts/      # React Context (Auth, Theme)
│   │   ├── services/      # API client (axios)
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, error handling
│   │   ├── controllers/   # Business logic
│   │   └── index.js       # Server entry
│   ├── uploads/           # User-uploaded images
│   └── package.json
│
└── README.md              # This file
```

---

## 🔑 Admin Access

Admins have special privileges to manage the platform:

1. **Auto-create Admin:** On server startup, an admin user is automatically created using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`
2. **Login:** Use the admin credentials at [http://localhost:5173/login](http://localhost:5173/login)
3. **Dashboard:** Navigate to `/admin` to access the admin panel
4. **Permissions:** Manage users, moderate listings, handle disputes, and more

---

## 📖 API Documentation

The backend provides REST endpoints at `/api/`:

- **Auth:** `/auth/login`, `/auth/signup`, `/auth/logout`
- **Items:** `/items` (CRUD operations)
- **Requests:** `/requests/mine`, `/requests/received`
- **Users:** `/users/profile`
- **Admin:** `/admin/*` (admin-only)

For detailed endpoint docs, refer to the route files in `server/src/routes/`.

---

## 🎨 Design System

This project uses a **premium, dark-modern design** with:
- Custom color tokens (bg, surface, text, muted, primary, accent)
- Consistent typography scale (desktop-first)
- 8px spacing rhythm
- Soft, subtle shadows
- Accessible contrast ratios (≥ 4.5:1)

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---


## 💬 Support

Have questions or run into issues? 

- **Check the docs** above
- **Open an issue** on GitHub
- **Contact:** admin@college-thrift.local

---

<div align="center">

**Made with ❤️ for MNIT Jaipur students**

![MNIT Logo](https://raw.githubusercontent.com/akshaymina/college-thrift-store/main/client/src/512px-Mnit_logo.png)

</div>
