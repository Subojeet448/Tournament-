# ⚡ BattleZone – Esports Tournament Platform

A complete mobile-first esports tournament app built with pure HTML, CSS & JavaScript.
No PHP, no server, no database needed. Runs on Vercel (or any static host).

## 🚀 Deploy to Vercel

1. Upload this folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import Repo
3. Click Deploy (no build settings needed)
4. Visit your URL → go to `/install.html` first!

## 📱 First-Time Setup

1. Open `yoursite.vercel.app/install.html`
2. Click **Install Now**
3. Done! Use:
   - **Admin**: `yoursite.vercel.app/admin/login.html` → admin / admin123
   - **User App**: `yoursite.vercel.app/login.html`

## 📁 File Structure

```
/
├── install.html          ← Run this first!
├── login.html            ← User login/signup
├── index.html            ← Tournament homepage
├── my_tournaments.html   ← My joined tournaments
├── wallet.html           ← Wallet & transactions
├── profile.html          ← User profile
├── admin/
│   ├── login.html        ← Admin login
│   ├── index.html        ← Dashboard
│   ├── tournament.html   ← Create/manage tournaments
│   ├── manage_tournament.html ← Set room, declare winner
│   ├── users.html        ← User management
│   └── settings.html     ← Admin settings
├── css/style.css         ← All styles
├── js/app.js             ← Shared JS + localStorage DB
└── vercel.json           ← Vercel config
```

## 🔑 Default Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |

## ⚠️ Notes

- All data stored in browser `localStorage` (per-device)
- Data resets if browser storage is cleared
- For production, replace localStorage with a real backend (Firebase, Supabase, etc.)
