# MNIT Thrift Store

A full-stack campus marketplace for MNIT students to buy, sell, and exchange items within the college community.

---

## Screenshots

| Home / Browse | Item Listing | Admin Dashboard |
|---|---|---|
| ![Home](images/createAccount.png) | ![Listing](images/itemList.png) | ![Admin](images/listItem.png) |


---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, React Router v6, Axios |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |

---

## Key Features

- **Authentication** — JWT-based login/signup with bcrypt password hashing and role-based access control (user / admin)
- **Marketplace** — Create, browse, and search item listings with image uploads
- **Buy Requests** — Send and manage purchase requests directly to sellers
- **Wishlist** — Save items for later
- **Admin Dashboard** — Manage users, moderate listings, and resolve disputes
- **Responsive UI** — Dark-themed design system built with TailwindCSS

---

## Project Structure

```
college-thrift-store/
├── client/                 # React frontend (Vite + TailwindCSS)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level pages
│       ├── contexts/       # Auth + Theme context (React Context API)
│       └── services/       # Axios API client
│
└── server/                 # Node.js / Express REST API
    └── src/
        ├── models/         # Mongoose schemas
        ├── routes/         # API endpoints
        ├── controllers/    # Business logic
        └── middleware/     # Auth guard, error handling
```

---

## Running Locally

**Prerequisites:** Node.js v18+, MongoDB (local or Atlas)

```bash
# 1. Clone
git clone https://github.com/akshaymina/college-thrift-store.git
cd college-thrift-store

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment
#    Create server/.env — see .env.example for required variables

# 4. Start servers (two terminals)
cd server && npm run dev      # API → http://localhost:5000/api
cd client && npm run dev      # App → http://localhost:5173
```

**Required environment variables** (create `server/.env`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

> An admin account is auto-created on first server start using the credentials above.

---

## API Endpoints

| Route | Description |
|---|---|
| `POST /api/auth/signup` | Register new user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/items` | Browse all listings |
| `POST /api/items` | Create a listing (auth required) |
| `GET /api/requests/mine` | View sent requests |
| `GET /api/requests/received` | View received requests |
| `GET /api/admin/*` | Admin-only management routes |
