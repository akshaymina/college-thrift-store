# 🚀 Quick Deployment Checklist

**Time needed:** ~30 minutes | **Cost:** $0 (all free tier)

---

## Before You Start
- [ ] Your code is pushed to GitHub (`git push origin main`)
- [ ] You have accounts ready: GitHub, MongoDB, Railway, Vercel

---

## **5 Steps to Deploy**

### **Step 1: Create MongoDB Database (5 min)**
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with GitHub
3. Create free M0 cluster
4. Create database user (save username & password)
5. Get connection string: mongodb+srv://username:password@cluster.xyz/college-thrift
6. Allow "Access from Anywhere" in Network Access
```
✅ **Save your connection string!**

---

### **Step 2: Deploy Backend on Railway (8 min)**
```
1. Go to: https://railway.app
2. Sign up with GitHub
3. Create New Project → Deploy from GitHub
4. Select your college-thrift-store repo
5. Wait for auto-deployment (2-3 min)
6. Go to "Variables" tab, add:
   - MONGO_URI = [your connection string]
   - JWT_SECRET = any-random-string
   - PORT = 5000
   - CORS_ORIGIN = (leave blank for now)
   - NODE_ENV = production
7. Copy Public URL (looks like: https://xxxxx.railway.app)
```
✅ **Save your backend URL!**

---

### **Step 3: Update Backend CORS**
```
1. In Railway dashboard, go to Variables
2. Update: CORS_ORIGIN = https://your-vercel-url.vercel.app
   (we'll get the Vercel URL in next step)
```

---

### **Step 4: Deploy Frontend on Vercel (5 min)**
```
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import Project → college-thrift-store
4. Configure:
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist
5. Add Environment Variables:
   - VITE_API_BASE = https://[your-railway-url]/api
   - VITE_UPLOAD_BASE = https://[your-railway-url]
6. Click Deploy
7. Wait ~2 min and get your URL (looks like: https://college-thrift-store.vercel.app)
```
✅ **This is your public link!**

---

### **Step 5: Update Backend CORS (Final Touch)**
```
1. Go back to Railway
2. Edit CORS_ORIGIN = your Vercel URL
3. Save and wait for redeploy (~1 min)
```

---

## 🎉 Done!

**Share this link with friends:**
```
https://college-thrift-store.vercel.app
```

### What they can do:
- ✅ Sign up
- ✅ List items
- ✅ Browse items
- ✅ Request items
- ✅ Use wishlist

**No installation needed!** Just open in browser. 🌐

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page | Check browser console (F12) for errors |
| API calls fail | Check `VITE_API_BASE` env var in Vercel matches Railway URL |
| Can't login | Verify `MONGO_URI` in Railway is correct |
| CORS errors | Update `CORS_ORIGIN` in Railway to match Vercel URL |
| Images broken | Check `VITE_UPLOAD_BASE` in Vercel |

---

## 📝 Updating Your App

After launch, to push updates:
```bash
git add .
git commit -m "Your change description"
git push origin main
```
Vercel auto-redeploys (~1 min). Done! ✨

---

## 📚 More Help

See **DEPLOYMENT_GUIDE.md** for detailed explanations!

---

**Questions?** Check Railway/Render/Vercel docs or ask in their support!
