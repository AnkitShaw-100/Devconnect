# DevConnect – `src` Folder Structure

`src` folder ke andar kya hai aur kaunsi file kya karti hai, iska simple guide. (Updated: React Router hata ke Next.js App Router pe migrate karne ke baad.)

## Overall structure

```
src/
├── app/                     → Har folder = ek URL (Next.js file-based routing)
│   ├── layout.js            → Poore app ka frame: navbar + sidebars
│   ├── page.js              → /
│   ├── explore/page.js      → /explore
│   ├── bookmarks/page.js    → /bookmarks
│   ├── profile/page.js      → /profile
│   ├── developers/
│   │   └── [username]/page.js → /developers/kuch-bhi-username
│   ├── not-found.js         → 404 page
│   ├── loading.js           → Loading skeleton
│   └── error.js             → Error page
├── components/              → UI ke saare chhote-bade tukde
│   ├── layout/              → Navbar, sidebars, nav links, poora dhaancha
│   ├── feed/                → Posts aur post likhne wala card
│   ├── developers/          → Developer cards (Explore page ke liye)
│   ├── pages/               → Har route ka asli content
│   ├── shared/              → Baar-baar use hone wale chhote components
│   └── ui/                  → shadcn ke components
├── data/                    → Dummy data (fake posts, developers)
└── lib/                     → Helpers: data padhna, URLs, active link check

tests/                       → Unit tests (project root mein)
e2e/                         → Browser tests, Playwright (project root mein)
```

Ek line mein: **`app` ka folder structure hi URL hai, `data` mein content hai, `lib` usse padhta hai, `components` mein design hai.**

---

## Routes (kaunsa URL, kaunsi file)

| URL | File | Page |
|---|---|---|
| `/` | `app/page.js` | Home feed |
| `/explore` | `app/explore/page.js` | Trending topics, developers, popular posts |
| `/bookmarks` | `app/bookmarks/page.js` | Saved posts |
| `/profile` | `app/profile/page.js` | Aapka apna profile (Jordan Lee) |
| `/developers/:username` | `app/developers/[username]/page.js` | Kisi bhi developer ka profile, jaise `/developers/priyacodes` |
| Baaki sab | `app/not-found.js` | Page not found (404) |

**Rule simple hai:** naya page chahiye? `app/` mein folder banao, andar `page.js` rakho. Bas, URL ban gaya.

---

## 1. `app/` – Routes aur special files

### `app/layout.js` ⭐ (sabse important file)

- Har page isi ke andar dikhta hai. Isme `<AppShell>` hai, yaani navbar, left sidebar aur right sidebar.
- Page badalne pe **layout dobara nahi banta**, sirf beech wala content (`children`) badalta hai. Isliye sidebar ka Follow state navigation ke baad bhi bana rehta hai.

### `app/page.js`, `explore/page.js`, `bookmarks/page.js`, `profile/page.js`

Chhoti files. Bas `components/pages/` se sahi page component render karti hain.

### `app/developers/[username]/page.js`

- `[username]` ke square brackets ka matlab hai **dynamic segment**: URL ka wo hissa kuch bhi ho sakta hai.
- `generateStaticParams`: build ke time pe saare 7 developers ke profile pehle se ready rakh leta hai.
- Koi aur username aaye (jaise `/developers/nobody`) toh `findDeveloperByParam` check karta hai. Developer nahi mila → `notFound()` → 404 page.

### `app/not-found.js`

404 page. Layout ke andar dikhta hai, isliye navbar aur sidebars rehte hain aur user wahan se kahin bhi ja sakta hai. Do case mein aata hai: (1) URL kisi folder se match nahi hua (jaise `/settings`), (2) kisi page ne `notFound()` call kiya.

### `app/loading.js`

Jab koi page server pe ban raha ho, tab **sirf beech wale column** mein skeleton dikhta hai; navbar aur sidebars asli rehte hain. Pehle se bane (prerendered) pages pe ye dikhta hi nahi.

### `app/error.js`

Page banate waqt error aaye toh beech wale column mein "Something went wrong" card, **Try again** aur **Go to home** ke saath. Error ki details sirf console mein jaati hain.

> Dhyan do: `error.js` layout ke andar ke errors pakadta hai, **layout ke khud ke** errors nahi. Uske liye Next.js mein alag `global-error.js` hota hai (abhi nahi banaya).

### `app/globals.css`

Global styling: Tailwind, shadcn theme colors aur font.

---

## 2. `components/layout/` – Page ka dhaancha

| File | Kya karti hai |
|---|---|
| `app-shell.jsx` | 3-column layout: left sidebar, beech mein content, right sidebar. Mobile pe sirf beech wala dikhta hai. `app/layout.js` ise use karta hai. |
| `nav-link.jsx` | Sidebar/mobile menu ka link. `usePathname()` se current URL padh ke active link **blue highlight** karta hai. (Client Component) |
| `navbar.jsx` | Upar ki bar: logo, search, notification bell, avatar (click → `/profile`) |
| `logo.jsx` | Blue box wala `</>` icon + "DevConnect" naam (click → Home) |
| `search-bar.jsx` | Search box with search icon |
| `mobile-nav.jsx` | Mobile pe ☰ button, jo left se menu slide karke kholta hai. Link click karo toh band ho jaata hai. |
| `sidebar.jsx` | Left side: profile card (naam click → `/profile`) + Home/Explore/Bookmarks/Profile links |
| `right-sidebar.jsx` | Right side ke 3 cards: Trending technologies, Suggested developers (naam click → unka profile), Community stats |
| `follow-button.jsx` | "Follow" button, click pe "Following" ban jaata hai |

**`nav-link.jsx` mein `<Suspense>` kyun hai?** Cache Components on hone par, agar URL ka username build ke time pata nahi tha (jaise `/developers/nobody`), toh `usePathname()` server pe ruk (suspend) jaata hai. `<Suspense>` us waqt bina highlight wala same link dikha deta hai, taaki baaki layout ban sake. Iske bina build fail hota hai.

---

## 3. `components/feed/` – Posts wala hissa

| File | Kya karti hai |
|---|---|
| `post-card.jsx` | Ek post ka card: avatar, naam (click → author ka profile), @username, time, content, tags, aur Like / Comment / Share buttons |
| `post-card-skeleton.jsx` | Loading ke time post card ki jagah grey placeholder |
| `like-button.jsx` ❤️ | `useState` se like yaad rakhta hai. Click pe dil laal aur count +1, dobara click pe wapas normal. |
| `create-post.jsx` | "Share what you're building…" wala box. Abhi sirf design hai, Post button disabled hai kyunki API nahi bani. |

---

## 4. `components/developers/`

| File | Kya karti hai |
|---|---|
| `developer-card.jsx` | Chhota developer card: avatar, naam (click → profile), role, top 3 skills, Follow button. Explore page pe grid mein dikhta hai. |

---

## 5. `components/pages/` – Har route ka asli content

| File | Kya karti hai |
|---|---|
| `home-page.jsx` | "Welcome back, Jordan" + create post + feed |
| `explore-page.jsx` | Trending topics, "Developers to follow" grid, "Popular this week" posts |
| `bookmarks-page.jsx` | Saved posts. Kuch saved nahi hai toh "No bookmarks yet". |
| `developer-profile-page.jsx` | Profile page: cover, avatar, naam, bio, location, joined date, followers/following/posts, skills, posts. Apna profile → "Edit profile" (abhi disabled), kisi aur ka → "Follow". Posts nahi → "No posts yet". |
| `not-found-page.jsx` | "Page not found" + Home aur Explore ke buttons |

`app/` ki `page.js` files patli hain aur asli design yahan hai. Isse `app/` mein sirf routing dikhti hai.

---

## 6. `components/shared/` – Reusable chhote parts

| File | Kya karti hai |
|---|---|
| `page-header.jsx` | Har page ke upar title + chhota description |
| `page-skeleton.jsx` | Loading ke time beech wale column ka skeleton (`app/loading.js` use karta hai) |
| `empty-state.jsx` | Icon + message wala card, jab dikhane ko kuch na ho (no bookmarks, no posts, 404, error) |
| `user-avatar.jsx` | Gol avatar jisme initials hote hain (jaise "PR") |
| `tech-tag.jsx` | `#React`, `#DevOps` jaise chhote tags |

---

## 7. `components/ui/` – shadcn components

Button, Card, Avatar, Badge, Input, Sheet, Separator, Dialog, Dropdown Menu, Skeleton. Ye shadcn/ui se aaye hain aur baaki components inhe use karte hain.

---

## 8. `data/` – Fake data (UI se alag)

| File | Kya hai |
|---|---|
| `developers.js` | Saare 7 developers: naam, username, role, bio, location, skills, followers. **Baaki sab files developers ko username se refer karti hain.** |
| `posts.js` | 3 sample posts. Har post mein bas `authorUsername` hai, poora author nahi. |
| `bookmarks.js` | Kaunse posts bookmark hain (post ids) |
| `community.js` | Trending tech, suggested developers ke usernames, community stats |
| `navigation.js` | Sidebar ke 4 links + unke icons. Desktop aur mobile dono yahin se lete hain. |
| `current-user.js` | Logged-in user "Jordan Lee" (abhi fake) |

---

## 9. `lib/` – Helpers

| File | Kya karti hai |
|---|---|
| `developers.js` | Data padhne wale functions: `getDeveloper`, `getFeedPosts`, `getPostsByDeveloper`, `getBookmarkedPosts`, `getPopularPosts`, aur `findDeveloperByParam`, jo URL ke username ko validate karta hai (sirf letters, numbers, `.`, `_`, `-`; galat encoding reject). Database aane pe sirf ye file badlegi. |
| `paths.js` | Saare URLs ek jagah (`paths.developer("priyacodes")` → `/developers/priyacodes`), aur `isActivePath`, jo batata hai kaunsa nav link active hai |
| `format.js` | Numbers ko short karta hai, jaise `1200` → `1.2K` |
| `utils.js` | CSS classes jodne wala `cn` function |

---

## 10. `tests/` – Unit tests (project root mein)

| File | Kya check karta hai |
|---|---|
| `routing.test.mjs` | Har URL ke liye `page.js` file hai; galat usernames reject hote hain; har developer ka username valid hai; active link ka logic sahi hai |
| `developers.test.mjs` | Data helpers sahi posts, bookmarks aur developers dete hain |

Chalane ke liye: `npm test` (Node ka built-in test runner, koi extra package nahi).

## 11. `e2e/` – Browser tests (Playwright, project root mein)

Ye tests asli Chromium browser mein app kholte hain aur user ki tarah click karte hain. Production build pe chalte hain (`playwright.config.mjs` khud build karke server start karta hai).

| File | Kya check karta hai |
|---|---|
| `fixtures.mjs` | Har test mein console error ya hydration error aaye toh test fail. Saath mein helper jo check karta hai ki navigation bina page reload ke hui. |
| `navigation.spec.mjs` | Har page direct khulta hai, sahi link active hota hai, bina reload page badalta hai, back/forward, scroll karne ke baad naya page upar se dikhta hai, layout ka state navigation mein bana rehta hai |
| `profiles.spec.mjs` | Author, Explore cards aur suggestions se profile khulta hai; encoded username (`meilin%2Edev`); Follow vs Edit profile; "No posts yet" |
| `not-found.spec.mjs` | Galat URLs pe 404 page + `noindex`, aur 404 page se wapas app mein jaana |
| `interactions.spec.mjs` | Like button count badhata/ghatata hai, Follow toggle hota hai, Post button disabled hai |
| `mobile.spec.mjs` | Phone size pe sidebars chhupte hain, ☰ menu khulta hai, link click pe page badalta hai aur menu band hota hai |

Chalane ke liye: `npm run test:e2e`

---

## Server vs Client Components: simple trick

Jis file ke upar **`"use client"`** likha hai, wo **browser mein chalti hai**, kyunki usme click, state, menu ya current URL ki zaroorat hai:

- `components/layout/nav-link.jsx` (current URL padhna: `usePathname()`)
- `components/layout/mobile-nav.jsx` (menu khulna/band hona)
- `components/layout/follow-button.jsx`
- `components/feed/like-button.jsx`
- `app/error.js` (Next.js mein error page hamesha client pe hota hai)

Baaki sab **server pe ban ke aati hain**. Pehle router ki 3 client files thi, ab ek bhi nahi. 🚀

---

## 📚 Pehle vs Ab: React Router vs Next.js App Router

### Pehle (React Router ke saath)

```
Koi bhi URL → app/[[...slug]]/page.js  (ek hi Next.js page sab URLs ke liye)
                  ↓
            RouteTree: saare pages ek saath server pe bana ke bhejo
                  ↓
            React Router (browser mein) decide karta tha kaunsa page dikhana hai
```

- Next.js ko bas ek page dikhta tha. Asli routing React Router karta tha, browser mein.
- Server pe `StaticRouter`, browser mein `BrowserRouter`, dono ko match karwana padta tha.
- **Saare pages (har profile bhi) pehli load mein hi aa jaate the.** 7 developers ke liye theek tha, 7,000 ke liye nahi.
- URL valid hai ya nahi, ye check do jagah tha: server pe `lib/routes.js` aur browser mein `<Routes>`. Dono ko sync rakhna padta tha.
- Scroll top pe le jaane ke liye khud `ScrollToTop` likhna pada.

### Ab (Next.js App Router)

```
/explore → app/explore/page.js
/developers/priyacodes → app/developers/[username]/page.js
Koi match nahi → app/not-found.js
```

- **Folder hi route hai.** Alag se route list nahi likhni padti.
- Layout ek baar banta hai aur bana rehta hai, sirf page badalta hai.
- Har page ka data **alag se, zaroorat pe** aata hai. `<Link>` dikhte hi Next.js use pehle se prefetch kar leta hai, isliye click pe turant khulta hai.
- 404, loading, error: bas file ka naam rakho (`not-found.js`, `loading.js`, `error.js`), Next.js khud jod deta hai.
- Scroll, back/forward: Next.js khud sambhalta hai.

### Side-by-side

| Cheez | Pehle (React Router) | Ab (App Router) |
|---|---|---|
| Route kahan define hota hai | `app-routes.jsx` mein `<Route path="...">` | `app/` ke folders |
| Link | `<Link to="/explore">` (react-router-dom) | `<Link href="/explore">` (next/link) |
| Active link | `<NavLink>` ka `isActive` | `usePathname()` + `isActivePath()` |
| Dynamic URL | `/developers/:username` + `useParams()` | `developers/[username]/` folder + `params` prop |
| Unknown URL | `<Route path="*">` + server pe alag check | `not-found.js` + `notFound()` |
| Loading / error | Khud banana padta | `loading.js` / `error.js` files |
| Navbar/sidebar | Har route ke saath router ke andar | `layout.js` mein, ek baar |
| Pehli load mein kya aata | Saare pages | Sirf current page |
| Router ki client files | 3 | 0 (sirf `nav-link.jsx`, active highlight ke liye) |
| Extra package | `react-router-dom` | Kuch nahi, Next.js mein built-in |

**Seekhne wali baat:** Next.js khud ek poora router hai. Uske andar doosra router (React Router) daalne se dono ko sync rakhna padta hai, aur Next.js ke features (prefetch, layouts, loading/error files) adhe-adhure use hote hain. Isliye Next.js project mein App Router hi use karna sahi hai.
