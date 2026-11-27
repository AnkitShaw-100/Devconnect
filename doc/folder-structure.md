# DevConnect – `src` Folder Structure

Milestone 1 (Homepage Foundation) mein `src` folder ke andar kya hai aur kaunsi file kya karti hai, iska simple guide.

## Overall structure

```
src/
├── app/            → Next.js ke pages (URL yahin se aata hai)
├── components/     → UI ke saare chhote-bade tukde
│   ├── router/     → React Router wala setup
│   ├── layout/     → Navbar, sidebars, poora dhaancha
│   ├── feed/       → Posts aur post likhne wala card
│   ├── pages/      → Har route ka page (Home, Explore...)
│   ├── shared/     → Baar-baar use hone wale chhote components
│   └── ui/         → shadcn ke components
├── data/           → Dummy data (fake posts, users)
└── lib/            → Helper functions
```

Ek line mein: **`data` mein content hai, `components` mein design hai, `app` dono ko jodta hai.**

---

## 1. `app/` – Entry point

### `app/[[...slug]]/page.js` ⭐ (sabse important file)

- Folder ka naam `[[...slug]]` ka matlab hai **"koi bhi URL ho, isi page pe aao"**. `/`, `/explore`, `/profile`, `/kuch/bhi` sab yahin aate hain.
- Ye file URL padhti hai (jaise `/explore`) aur React Router ko de deti hai.
- Saare pages (Home, Explore, etc.) yahin se banake router ko pass karti hai.
- `generateStaticParams` batata hai ki build ke time pe 4 pages (`/`, `/explore`, `/bookmarks`, `/profile`) pehle se ready rakh lo, taaki fast khulein.

### `app/layout.js`

Poori website ka outer frame (font, title, background).

### `app/globals.css`

Global styling: Tailwind, shadcn theme colors aur font.

---

## 2. `components/router/` – Navigation ka dimaag

### `app-router.jsx`

- Server pe `StaticRouter` use karta hai, kyunki server pe browser hota hi nahi.
- Browser mein `BrowserRouter` use karta hai.
- Dono same cheez dikhate hain, isliye page smoothly load hota hai.

### `app-routes.jsx`

Yahan likha hai ki kaunsa URL, kaunsa page:

| URL | Page |
|---|---|
| `/` | Home |
| `/explore` | Explore |
| `/bookmarks` | Bookmarks |
| `/profile` | My Profile |
| Baaki sab | Page not found |

Saath mein `ScrollToTop` hai, jo page badalne pe upar scroll kar deta hai.

### `router-links.jsx`

- `SidebarNavLink`: sidebar ka link. Jis page pe ho, wo **blue highlight** ho jaata hai (active state).
- `RouterLink`: simple link, jaise logo pe click karke Home jaana.

---

## 3. `components/layout/` – Page ka dhaancha

| File | Kya karti hai |
|---|---|
| `app-shell.jsx` | 3-column layout banati hai: left sidebar, beech mein feed, right sidebar. Mobile pe sirf beech wala dikhta hai. |
| `navbar.jsx` | Upar ki bar: logo, search, notification bell, avatar |
| `logo.jsx` | Blue box wala `</>` icon + "DevConnect" naam |
| `search-bar.jsx` | Search box with search icon |
| `mobile-nav.jsx` | Mobile pe ☰ button, jo left se menu slide karke kholta hai. Link click karo toh band ho jaata hai. |
| `sidebar.jsx` | Left side: profile card + Home/Explore/Bookmarks/Profile links |
| `right-sidebar.jsx` | Right side ke 3 cards: Trending technologies, Suggested developers, Community stats |
| `follow-button.jsx` | "Follow" button, click pe "Following" ban jaata hai |

---

## 4. `components/feed/` – Posts wala hissa

| File | Kya karti hai |
|---|---|
| `post-card.jsx` | Ek post ka card: avatar, naam, @username, time, content, tags, aur neeche Like / Comment / Share buttons |
| `like-button.jsx` ❤️ | `useState` se like ka state yaad rakhta hai. Click pe dil laal aur count +1, dobara click pe wapas normal. |
| `create-post.jsx` | "Share what you're building…" wala box. Abhi sirf design hai, Post button disabled hai kyunki API nahi bani. |

---

## 5. `components/pages/` – Har route ka content

| File | Kya karti hai |
|---|---|
| `home-page.jsx` | "Welcome back, Jordan" + create post + 3 posts |
| `route-pages.jsx` | Explore, Bookmarks, Profile aur Not Found pages |
| `placeholder-page.jsx` | In placeholder pages ka common design (icon + title + message). Ek baar banaya, 4 jagah use kiya. |

---

## 6. `components/shared/` – Reusable chhote parts

| File | Kya karti hai |
|---|---|
| `user-avatar.jsx` | Gol avatar jisme initials hote hain (jaise "PR"). Photo nahi hai, isliye rangeen initials dikhte hain. |
| `tech-tag.jsx` | `#React`, `#DevOps` jaise chhote tags |

---

## 7. `components/ui/` – shadcn components

Button, Card, Avatar, Badge, Input, Sheet, Separator, Dialog, Dropdown Menu, Skeleton. Ye shadcn/ui se aaye hain aur baaki components inhe use karte hain.

---

## 8. `data/` – Fake data (UI se alag)

| File | Kya hai |
|---|---|
| `posts.js` | 3 sample posts (Priya, Daniel, Mei) |
| `community.js` | Trending tech, suggested developers, community stats |
| `navigation.js` | Sidebar ke 4 links + unke icons. Desktop aur mobile dono yahin se lete hain. |
| `current-user.js` | Logged-in user "Jordan Lee" (abhi fake) |

**Fayda:** baad mein database aayega toh sirf ye data badlega, UI wale components waise hi rahenge.

---

## 9. `lib/` – Helpers

| File | Kya karti hai |
|---|---|
| `utils.js` | CSS classes jodne wala `cn` function |
| `format.js` | Numbers ko short karta hai, jaise `1200` → `1.2K` |

---

## Server vs Client Components: simple trick

Jis file ke upar **`"use client"`** likha hai, wo **browser mein chalti hai**, kyunki usme click, state ya menu hai:

- `components/router/app-router.jsx`
- `components/router/app-routes.jsx`
- `components/router/router-links.jsx`
- `components/feed/like-button.jsx`
- `components/layout/follow-button.jsx`
- `components/layout/mobile-nav.jsx`

Baaki sab **server pe ban ke aati hain**, isliye page fast load hota hai. 🚀
