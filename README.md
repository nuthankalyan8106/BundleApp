# 🎯 BundleHub
### The World's First Goal-Based Shopping Platform

---

## 📁 Project Structure

```
bundlehub/
│
├── frontend/
│   ├── index.html          ← Main app (all pages live here)
│   ├── css/
│   │   ├── base.css        ← Variables, reset, nav, buttons, layout
│   │   ├── auth.css        ← Login/signup modal styles
│   │   ├── components.css  ← Hero, bundle cards, categories, AI section
│   │   └── pages.css       ← Detail, cart, profile page styles
│   └── js/
│       ├── data.js         ← All bundle & creator bundle data
│       ├── auth.js         ← Login, signup, session management
│       ├── app.js          ← Page routing, bundle rendering, cart
│       └── ai.js           ← AI bundle builder (Claude API)
│
├── backend/
│   ├── index.js            ← Express + MongoDB API
│   ├── package.json        ← Backend dependencies and scripts
│   └── .env.example        ← Local env template for Compass/MongoDB
│
└── README.md               ← This file
```

---

## 🚀 Running Locally

For the MongoDB-backed version, run the Node server and point it at your local MongoDB instance.

```bash
cd backend
npm install
copy .env.example .env
npm start
# Then open http://localhost:3000
```

If you want to keep using the static prototype, you can still open `frontend/index.html` directly. In that mode, auth falls back to browser storage when MongoDB is unavailable.

---

## ✅ What Works Right Now

| Feature | Status |
|---|---|
| Email Sign Up | ✅ API-backed, with local fallback |
| Email Sign In | ✅ API-backed, with local fallback |
| Session persistence (stays logged in) | ✅ API-backed session token + local fallback |
| User profile page | ✅ Fully working |
| Sign out | ✅ Fully working |
| Browse bundles by category | ✅ Fully working |
| Bundle detail view | ✅ Fully working |
| Add to cart | ✅ Fully working |
| AI bundle builder | ✅ Fully working (via Claude API) |
| Creator bundles | ✅ Fully working |
| Google Sign-In | ⚙️ Needs Firebase (see below) |

---

## 🗄 MongoDB / Compass Setup

1. Start MongoDB locally or connect to your remote cluster.
2. Open MongoDB Compass and connect using the same URI you put in `.env`.
3. Make sure the database name in `MONGODB_URI` is `bundlehub` or update both values together.
4. Run `npm start` and sign up from the app. New users will appear in the `users` collection.

The backend reads `MONGODB_URI` and `JWT_SECRET` from `backend/.env`. A ready-to-edit template is in [backend/.env.example](backend/.env.example).

---

## 🌐 Deploying to a .com Website

### Netlify (Easiest — free)
1. Go to https://netlify.com → sign up free
2. Drag the `frontend/` folder onto the deploy area for the static site
3. Get a live URL instantly (e.g. `bundlehub.netlify.app`)
4. Deploy `backend/` separately if you want the API live too
5. Buy your domain → Settings → Domain management → Add custom domain

### Vercel
```bash
npm i -g vercel
cd backend
vercel
```

### GitHub Pages
1. Push this folder to a GitHub repo
2. Settings → Pages → Deploy from branch → `main` / `root`

---

## 🛣️ Roadmap

- [ ] Real Firebase Google OAuth
- [x] Backend API (Node.js + MongoDB)
- [ ] Real product catalog (Amazon / Flipkart affiliate)
- [ ] Payments (Razorpay)
- [ ] Creator bundle monetization
- [ ] AR room visualizer for home bundles
- [ ] AI virtual try-on for fashion bundles
- [ ] Mobile app (React Native)

---

Built with ❤️ — BundleHub © 2025
