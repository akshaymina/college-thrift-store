# 🚀 Deployment Guide - College Thrift Store

Complete guide to deploy your app so your friends can access it online without needing Node.js or Linux!

---

## **Architecture Overview**

```
Your App:
  Frontend (React) → Deployed on Vercel (free)
       ↓
  Backend (Express) → Deployed on Railway or Render (free tier)
       ↓
  Database (MongoDB) → Deployed on MongoDB Atlas (free tier)
```

All free! Your friends just need to open a link in their browser. 🎉

---

## **Step 1: Set Up MongoDB Atlas (Database)**

MongoDB Atlas is a free cloud database. This is where your data lives.

### 1.1 Create MongoDB Account
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Try Free" → Sign up with email or GitHub
- Create a new organization and project

### 1.2 Create a Cluster
- On the dashboard, click "Create Deployment"
- Choose **M0 Sandbox** (free tier, up to 512 MB storage)
- Select your closest region
- Click "Create"
- Wait ~3 minutes for the cluster to initialize

### 1.3 Get Your Connection String
1. Click "Connect" button on your cluster
2. Choose "Drivers" → **Node.js** 
3. Copy the connection string that looks like:
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/college-thrift?retryWrites=true&w=majority
   ```
4. Replace `username` and `password` with a database user:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Click "Add User"
5. Also go to "Network Access" → Click "Add IP Address" → Select "Allow Access from Anywhere" (OK for learning project)

**Save your connection string!** You'll need it in the next step.

---

## **Step 2: Deploy Backend (Express Server)**

You can use **Railway** (easiest) or **Render**. I'll show Railway first.

### Option A: Railway (Recommended - Easiest) ⭐

#### 2A.1 Prepare Your Server Code
1. Make sure your `server/.env.example` exists (already created!)
2. In `server/package.json`, ensure `"start"` script is present:
   ```json
   "scripts": {
     "start": "node src/index.js",
     "dev": "nodemon src/index.js"
   }
   ```
   (Change `start` from `nodemon` to `node` for production)

#### 2A.2 Push to GitHub
1. Go to: https://github.com/new
2. Create a repo named `college-thrift-store` (if not already there)
3. Push your code:
   ```bash
   cd /home/akshay/Projects/College\ Thrift
   git add .
   git commit -m "Add deployment files"
   git push origin main
   ```

#### 2A.3 Deploy on Railway
1. Go to: https://railway.app
2. Sign up with GitHub (click "Login with GitHub")
3. Click "Create New Project" → "Deploy from GitHub repo"
4. Select your `college-thrift-store` repo
5. Railway auto-detects it's a Node.js project. Click "Deploy"
6. Wait ~2-3 minutes for deployment

#### 2A.4 Add Environment Variables in Railway
1. In Railway dashboard, go to your project
2. Click on the "server" service
3. Go to "Variables" tab
4. Click "New Variable" and add:
   ```
   PORT=5000
   MONGO_URI=[your MongoDB connection string from Step 1]
   JWT_SECRET=your-super-secret-key-change-this
   CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
   NODE_ENV=production
   ```
5. Click "Save"
6. Your server will auto-redeploy. Go to "Settings" and copy your **Public URL** (looks like `https://xxxxx.railway.app`)

**Save this URL!** You'll need it for the frontend.

---

### Option B: Render (Alternative)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Fill in:
   - **Name**: college-thrift-backend
   - **Runtime**: Node
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `node server/src/index.js`
6. Click "Advanced" and add environment variables:
   ```
   PORT=5000
   MONGO_URI=[your MongoDB connection string]
   JWT_SECRET=your-secret
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   NODE_ENV=production
   ```
7. Click "Deploy"

Copy the deployed URL when ready!

---

## **Step 3: Deploy Frontend (React App)**

Vercel is where your frontend lives. Your friends open this link!

### 3.1 Prepare Frontend
1. Open `client/.env.local` (or create it):
   ```
   VITE_API_BASE=https://[your-backend-url].railway.app/api
   VITE_UPLOAD_BASE=https://[your-backend-url].railway.app
   ```
   Replace `[your-backend-url]` with the URL from Step 2!

2. Push to GitHub:
   ```bash
   git add client/
   git commit -m "Add frontend env config"
   git push origin main
   ```

### 3.2 Deploy on Vercel
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `college-thrift-store` repo
5. Vercel auto-detects it's a monorepo. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Environment Variables" and add:
   ```
   VITE_API_BASE = https://[your-backend-url]/api
   VITE_UPLOAD_BASE = https://[your-backend-url]
   ```
7. Click "Deploy"

**Wait ~1-2 minutes.** Your app is live! 🎉

Vercel gives you a URL like: `https://college-thrift-store.vercel.app`

**Share this link with your friends!**

---

## **Step 4: Update Backend CORS (Important!)**

Your backend needs to allow requests from your frontend.

1. In Railway/Render dashboard, go to your backend service
2. Edit environment variable:
   ```
   CORS_ORIGIN=https://college-thrift-store.vercel.app
   ```
3. Save and let it redeploy

---

## **Testing Your Deployment**

1. Open: `https://college-thrift-store.vercel.app` (your Vercel URL)
2. Try to **Sign Up** or **Log In**
3. If it works → 🎉 You're done!
4. If it doesn't work → Check browser console (F12) for errors

### Common Issues:

| Issue | Solution |
|-------|----------|
| **Blank page** | Check browser console (F12), look for errors |
| **API calls failing** | Check `VITE_API_BASE` in Vercel env vars matches your backend URL |
| **Login not working** | Make sure `MONGO_URI` is correct in Railway/Render |
| **Images not showing** | Check `VITE_UPLOAD_BASE` points to correct backend URL |
| **CORS errors** | Update `CORS_ORIGIN` in backend to match your Vercel URL |

---

## **Sharing with Friends**

Just send them this link:
```
https://college-thrift-store.vercel.app
```

They can:
- ✅ Sign up and create an account
- ✅ List items they want to give
- ✅ Browse items from others
- ✅ Request items
- ✅ Use wishlist

**No installation needed!** Just a browser. 🌐

---

## **Optional: Custom Domain**

If you want a custom domain like `thrift.yourname.com`:

1. Buy a domain from: GoDaddy, Namecheap, or Google Domains (~$10/year)
2. In Vercel dashboard:
   - Go to "Settings" → "Domains"
   - Add your domain
   - Update DNS records at your domain provider (Vercel gives you instructions)

---

## **Updating Your App**

To push updates live:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Fix: description of what you fixed"
   git push origin main
   ```
3. **Vercel automatically redeploys** whenever you push! (takes ~1 minute)
4. Refresh the link and you'll see your changes

---

## **Monitoring & Logs**

- **Vercel Logs**: Dashboard → "Deployments" tab → click latest → "Function Logs"
- **Railway Logs**: Click service → "Logs" tab (real-time logs)
- **MongoDB**: Check Atlas dashboard for connection issues

---

## **Next Steps / Optimizations**

- [ ] Add custom domain
- [ ] Enable analytics on Vercel
- [ ] Set up error monitoring (Sentry.io - free tier)
- [ ] Increase file upload size (currently limited)
- [ ] Add rate limiting to API

---

**You're all set! 🚀 Your friends can now use your app online!**

Need help? Check error logs or ask in the Railway/Render/Vercel documentation.
