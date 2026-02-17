# Markd — Bookmark Manager

A full-stack bookmark manager built with Next.js 14 (App Router), Supabase (Auth + Database + Realtime), and Tailwind CSS.

![Markd Screenshot](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=flat&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)

## ✨ Features

- 🔐 **Google OAuth Authentication** - No email/password required
- 🔖 **Save Bookmarks** - Add URL + title with auto-validation
- 🔒 **Private & Secure** - Row Level Security ensures your bookmarks are yours alone
- ⚡ **Real-time Sync** - Updates instantly across all tabs (Supabase Realtime)
- 🗑️ **Delete Bookmarks** - Remove bookmarks with confirmation
- 🎨 **Modern UI** - Dark theme with smooth animations
- 🚀 **Deploy Ready** - One-click deploy to Vercel

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download here](https://nodejs.org))
- A **Supabase** account (free tier works) - [Sign up](https://supabase.com)
- A **Vercel** account for deployment (optional) - [Sign up](https://vercel.com)
- A **Google Cloud** project for OAuth - [Console](https://console.cloud.google.com)

---

## 🚀 Quick Start

### 1️⃣ Set Up Supabase

#### Create a Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Enter project details:
   - **Name**: `markd` (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
4. Wait ~2 minutes for provisioning

#### Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

4. Click **Run** (or press Ctrl/Cmd + Enter)

#### Verify Realtime is Enabled

1. Go to **Database** → **Replication**
2. Confirm `bookmarks` appears under `supabase_realtime` publication
3. If not, it was added by the SQL above automatically

#### Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** → Example: `https://xxxxx.supabase.co`
   - **anon public key** → Long JWT token starting with `eyJ...`

Keep these handy for the next step!

---

### 2️⃣ Set Up Google OAuth

#### Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select or create a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. If prompted, configure the OAuth consent screen first:
   - User Type: **External**
   - App name: **Markd** (or your choice)
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue** through the scopes and test users
6. Back on Credentials page, click **Create Credentials** → **OAuth 2.0 Client IDs**
7. Configure the OAuth client:
   - Application type: **Web application**
   - Name: **Markd Web Client**
   - **Authorized JavaScript origins**: Add your Supabase URL
     ```
     https://your-project-ref.supabase.co
     ```
   - **Authorized redirect URIs**: Add Supabase auth callback
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
   - Replace `your-project-ref` with your actual Supabase project reference
     - Find it in Supabase → **Settings** → **General** → **Reference ID**
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

#### Configure Google Provider in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click it
3. Toggle **Enable Sign in with Google** to **ON**
4. Paste your **Client ID** and **Client Secret** from Google Cloud
5. Click **Save**

---

### 3️⃣ Clone and Install Locally

#### Clone the Repository

```bash
# Clone this repository
git clone https://github.com/your-username/bookmark-manager.git
cd bookmark-manager

# Or if you created files manually, skip to install
```

#### Install Dependencies

```bash
npm install
```

#### Create Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 1.

#### Add Localhost to Supabase Redirect URLs

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/**
   ```
3. Click **Save**

#### Run the Development Server

```bash
npm run dev
```

#### Test the App

1. Open [http://localhost:3000](http://localhost:3000)
2. Click **Continue with Google**
3. Sign in with your Google account
4. You should be redirected to the dashboard
5. Try adding a bookmark
6. Open the same URL in another tab - changes sync in real-time! ⚡

---

## 🌐 Deploy to Vercel (Production)

### 1. Push to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit: Markd bookmark manager"
git branch -M main
git remote add origin https://github.com/your-username/bookmark-manager.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `bookmark-manager` repository
4. Under **Environment Variables**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
   ```
5. Click **Deploy**
6. Wait for deployment to complete (~2 minutes)
7. Copy your production URL (e.g., `https://bookmark-manager-xyz.vercel.app`)

### 3. Update Supabase with Production URL

#### In Supabase

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL:
   ```
   https://bookmark-manager-xyz.vercel.app
   ```
3. Under **Redirect URLs**, add:
   ```
   https://bookmark-manager-xyz.vercel.app/**
   ```
4. Click **Save**

#### In Google Cloud Console (if needed)

The redirect URIs should already point to Supabase (not Vercel), so no changes needed. But verify:

1. Go to Google Cloud Console → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Confirm **Authorized redirect URIs** includes:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

### 4. Test Production

1. Visit your Vercel URL
2. Sign in with Google
3. Add and delete bookmarks
4. Open in multiple tabs to test real-time sync

🎉 **Your app is live!**

---

## 📁 Project Structure

```
bookmark-manager/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── page.tsx                # Landing/login page
│   │   ├── globals.css             # Global styles + animations
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts        # OAuth callback handler
│   │   │   └── auth-code-error/
│   │   │       └── page.tsx        # Auth error page
│   │   └── dashboard/
│   │       └── page.tsx            # Protected dashboard (server component)
│   ├── components/
│   │   ├── LoginButton.tsx         # Google OAuth button
│   │   ├── BookmarkDashboard.tsx   # Main dashboard with realtime
│   │   ├── AddBookmarkForm.tsx     # Form to add bookmarks
│   │   └── BookmarkCard.tsx        # Individual bookmark card
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts           # Browser Supabase client
│   │       └── server.ts           # Server Supabase client
│   ├── middleware.ts               # Auth middleware + route protection
│   └── types/
│       └── bookmark.ts             # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── .env.local                      # Environment variables (not committed)
├── .gitignore
└── README.md
```

---

## 🔧 How It Works

### Authentication Flow

1. User clicks "Continue with Google"
2. `LoginButton.tsx` calls `supabase.auth.signInWithOAuth()`
3. User is redirected to Google OAuth consent screen
4. After approval, Google redirects to Supabase callback URL
5. Supabase exchanges code for session
6. User is redirected to `/auth/callback` route
7. Route handler exchanges code for session and redirects to `/dashboard`
8. Middleware checks session on every request

### Real-time Updates

The `BookmarkDashboard` component subscribes to Supabase Realtime:

```ts
supabase
  .channel("bookmarks-channel")
  .on("postgres_changes", {
    event: "INSERT",
    schema: "public",
    table: "bookmarks",
    filter: `user_id=eq.${user.id}`,
  }, (payload) => {
    // Add new bookmark to state
    setBookmarks((prev) => [payload.new, ...prev]);
  })
  .on("postgres_changes", {
    event: "DELETE",
    // ...
  }, (payload) => {
    // Remove deleted bookmark from state
    setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
  })
  .subscribe();
```

**Open two tabs** → add a bookmark in one → it appears instantly in the other!

### Row Level Security

Supabase RLS policies ensure:
- Users only see their own bookmarks (`WHERE user_id = auth.uid()`)
- Users can only insert bookmarks for themselves
- Users can only delete their own bookmarks

Even if someone tries to manipulate requests, the database enforces these rules.

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS |
| **Authentication** | Supabase Auth (Google OAuth) |
| **Database** | Supabase PostgreSQL |
| **Real-time** | Supabase Realtime |
| **Hosting** | Vercel |

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGci...` |

These must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

---

## 🐛 Troubleshooting

### "Auth code error" after Google login

**Solution**: 
1. Verify redirect URLs in Supabase → Authentication → URL Configuration
2. Make sure you added `http://localhost:3000/**` for local dev
3. For production, add your Vercel URL: `https://your-app.vercel.app/**`

### Bookmarks not syncing in real-time

**Solution**:
1. Verify Realtime is enabled: Database → Replication → check `bookmarks` table
2. Run this SQL to ensure it's added:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
   ```

### "Failed to save bookmark"

**Solution**:
1. Check browser console for errors
2. Verify RLS policies are set correctly (run the SQL from Step 1)
3. Make sure you're logged in (session is valid)

### Google OAuth not working

**Solution**:
1. Double-check Client ID and Secret in Supabase → Authentication → Providers → Google
2. Verify authorized redirect URIs in Google Cloud Console
3. Should be: `https://your-project-ref.supabase.co/auth/v1/callback`

---

## 🔐 Security Notes

- **Never commit `.env.local`** - it's in `.gitignore` by default
- **Row Level Security** is enabled on the `bookmarks` table
- **HTTPS only** in production (Vercel does this automatically)
- **Google OAuth** tokens are managed by Supabase
- Session cookies are HTTP-only and secure

---

## 🚧 Future Enhancements

Potential features to add:

- [ ] Search and filter bookmarks
- [ ] Tags/categories
- [ ] Bookmark folders
- [ ] Export bookmarks (CSV/JSON)
- [ ] Browser extension
- [ ] Shared collections
- [ ] Bookmark previews/screenshots
- [ ] Dark/light theme toggle

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💬 Support

If you have questions or run into issues:

1. Check the **Troubleshooting** section above
2. Open an issue on GitHub
3. Refer to official docs:
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Supabase Documentation](https://supabase.com/docs)
   - [Vercel Documentation](https://vercel.com/docs)

---

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- Deployed on [Vercel](https://vercel.com)
- UI inspired by modern design principles

---

**Made with ❤️ using Next.js, Supabase, and Tailwind CSS**