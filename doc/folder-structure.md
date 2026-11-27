# DevConnect – `src` Folder Structure

`src` folder ke andar kya hai aur kaunsi file kya karti hai, iska simple guide. (Milestone 2: Routing and page structure tak updated.)

## Overall structure

```
src/
├── app/              → Next.js ke pages, 404, loading aur error (URL yahin se aata hai)
├── components/       → UI ke saare chhote-bade tukde
│   ├── router/       → React Router wala setup
│   ├── layout/       → Navbar, sidebars, poora dhaancha
│   ├── feed/         → Posts aur post likhne wala card
│   ├── developers/   → Developer cards (Explore page ke liye)
│   ├── pages/        → Har route ka page (Home, Explore, Profile...)
│   ├── shared/       → Baar-baar use hone wale chhote components
│   └── ui/           → shadcn ke components
├── data/             → Dummy data (fake posts, developers)
└── lib/              → Helpers: data padhna, URLs, route check

tests/                → Unit tests (src ke bahar, project root mein)
```

Ek line mein: **`data` mein content hai, `lib` usse padhta hai, `components` mein design hai, `app` sabko jodta hai.**

---

## Routes (kaunsa URL, kaunsa page)

| URL | Page |
|---|---|
| `/` | Home feed |
| `/explore` | Explore: trending topics, developers, popular posts |
| `/bookmarks` | Saved posts |
| `/profile` | Aapka apna profile (Jordan Lee) |
| `/developers/:username` | Kisi bhi developer ka profile, jaise `/developers/priyacodes` |
| Baaki sab | Page not found (404) |

---

## 1. `app/` – Entry point

### `app/[[...slug]]/page.js` ⭐ (sabse important file)

- Folder ka naam `[[...slug]]` ka matlab hai **"koi bhi URL ho, isi page pe aao"**.
- Ye file URL padhti hai aur `resolveRoute` se check karti hai ki wo page exist karta hai ya nahi.
  - Exist karta hai → `RouteTree` render hota hai.
  - Nahi karta (jaise `/settings` ya `/developers/nobody`) → `notFound()` call hota hai aur 404 page dikhta hai.
- `generateStaticParams` build ke time pe saare known pages (4 main pages + har developer ka profile) pehle se ready rakh leta hai, taaki fast khulein.

### `app/[[...slug]]/loading.js`

Jab koi page server pe ban raha ho, tab skeleton (grey placeholder boxes) dikhata hai. App ke andar link click karne pe ye nahi dikhta, kyunki wo navigation browser mein turant hoti hai.

### `app/[[...slug]]/error.js`

Agar page banate waqt koi error aa jaye, toh "Something went wrong" card dikhata hai, saath mein **Try again** aur **Go to home** buttons. Error ki details sirf console mein jaati hain, user ko nahi dikhti.

### `app/not-found.js`

404 page. Ye bhi poora app (navbar, sidebars) dikhata hai, beech mein "Page not found" ke saath, taaki user wahan se kahin bhi ja sake.

### `app/layout.js`

Poori website ka outer frame (font, title, background).

### `app/globals.css`

Global styling: Tailwind, shadcn theme colors aur font.

---

## 2. `components/router/` – Navigation ka dimaag

| File | Kya karti hai |
|---|---|
| `route-tree.jsx` | Ek URL ke liye poora app jodti hai: router + layout + saare pages. `page.js` aur `not-found.js` dono isi ko use karte hain. |
| `app-router.jsx` | Server pe `StaticRouter`, browser mein `BrowserRouter`. Dono same cheez dikhate hain, isliye page smoothly load hota hai. |
| `app-routes.jsx` | URL → page wali list (upar wali table). `/developers/:username` ke liye `DeveloperRoute` sahi profile chunta hai, ya 404 dikhata hai. Saath mein `ScrollToTop`, jo page badalne pe upar scroll karta hai. |
| `router-links.jsx` | `SidebarNavLink`: sidebar ka link, jis page pe ho wo **blue highlight** hota hai (active state). `RouterLink`: simple link, jaise naam ya avatar pe click karke profile kholna. |

---

## 3. `components/layout/` – Page ka dhaancha

| File | Kya karti hai |
|---|---|
| `app-shell.jsx` | 3-column layout: left sidebar, beech mein content, right sidebar. Mobile pe sirf beech wala dikhta hai. |
| `app-shell-skeleton.jsx` | Loading ke time wala layout: same shape, bas grey boxes |
| `navbar.jsx` | Upar ki bar: logo, search, notification bell, avatar (avatar click → `/profile`) |
| `logo.jsx` | Blue box wala `</>` icon + "DevConnect" naam |
| `search-bar.jsx` | Search box with search icon |
| `mobile-nav.jsx` | Mobile pe ☰ button, jo left se menu slide karke kholta hai. Link click karo toh band ho jaata hai. |
| `sidebar.jsx` | Left side: profile card (naam click → `/profile`) + Home/Explore/Bookmarks/Profile links |
| `right-sidebar.jsx` | Right side ke 3 cards: Trending technologies, Suggested developers (naam click → unka profile), Community stats |
| `follow-button.jsx` | "Follow" button, click pe "Following" ban jaata hai |

---

## 4. `components/feed/` – Posts wala hissa

| File | Kya karti hai |
|---|---|
| `post-card.jsx` | Ek post ka card: avatar, naam (click → author ka profile), @username, time, content, tags, aur Like / Comment / Share buttons |
| `post-card-skeleton.jsx` | Loading ke time post card ki jagah grey placeholder |
| `like-button.jsx` ❤️ | `useState` se like yaad rakhta hai. Click pe dil laal aur count +1, dobara click pe wapas normal. |
| `create-post.jsx` | "Share what you're building…" wala box. Abhi sirf design hai, Post button disabled hai kyunki API nahi bani. |

---

## 5. `components/developers/`

| File | Kya karti hai |
|---|---|
| `developer-card.jsx` | Chhota developer card: avatar, naam (click → profile), role, top 3 skills, Follow button. Explore page pe grid mein dikhta hai. |

---

## 6. `components/pages/` – Har route ka content

| File | Kya karti hai |
|---|---|
| `home-page.jsx` | "Welcome back, Jordan" + create post + feed |
| `explore-page.jsx` | Trending topics, "Developers to follow" grid, "Popular this week" posts |
| `bookmarks-page.jsx` | Saved posts. Kuch saved nahi hai toh "No bookmarks yet" dikhata hai. |
| `developer-profile-page.jsx` | Profile page: cover, avatar, naam, bio, location, joined date, followers/following/posts, skills, aur posts. Apna profile ho toh "Edit profile" (abhi disabled), kisi aur ka ho toh "Follow". Posts nahi hain toh "No posts yet". |
| `not-found-page.jsx` | "Page not found" + Home aur Explore ke buttons |

---

## 7. `components/shared/` – Reusable chhote parts

| File | Kya karti hai |
|---|---|
| `page-header.jsx` | Har page ke upar title + chhota description |
| `empty-state.jsx` | Icon + message wala card, jab dikhane ko kuch na ho (no bookmarks, no posts, 404, error) |
| `user-avatar.jsx` | Gol avatar jisme initials hote hain (jaise "PR"). Photo nahi hai, isliye rangeen initials dikhte hain. |
| `tech-tag.jsx` | `#React`, `#DevOps` jaise chhote tags |

---

## 8. `components/ui/` – shadcn components

Button, Card, Avatar, Badge, Input, Sheet, Separator, Dialog, Dropdown Menu, Skeleton. Ye shadcn/ui se aaye hain aur baaki components inhe use karte hain.

---

## 9. `data/` – Fake data (UI se alag)

| File | Kya hai |
|---|---|
| `developers.js` | Saare 7 developers: naam, username, role, bio, location, skills, followers. **Baaki sab files developers ko username se refer karti hain.** |
| `posts.js` | 3 sample posts. Har post mein bas `authorUsername` hai, poora author nahi. |
| `bookmarks.js` | Kaunse posts bookmark hain (post ids) |
| `community.js` | Trending tech, suggested developers ke usernames, community stats |
| `navigation.js` | Sidebar ke 4 links + unke icons. Desktop aur mobile dono yahin se lete hain. |
| `current-user.js` | Logged-in user "Jordan Lee" (abhi fake) |

---

## 10. `lib/` – Helpers

| File | Kya karti hai |
|---|---|
| `developers.js` | Data padhne wale functions: `getDeveloper`, `getFeedPosts`, `getPostsByDeveloper`, `getBookmarkedPosts`, `getPopularPosts`, etc. Database aane pe sirf ye file badlegi, components nahi. |
| `routes.js` | `resolveRoute`: server pe check karta hai ki URL valid hai ya nahi. Username ka format bhi check karta hai (sirf letters, numbers, `.`, `_`, `-`). |
| `paths.js` | Saare URLs ek jagah, jaise `paths.developer("priyacodes")` → `/developers/priyacodes` |
| `format.js` | Numbers ko short karta hai, jaise `1200` → `1.2K` |
| `utils.js` | CSS classes jodne wala `cn` function |

---

## 11. `tests/` – Unit tests (project root mein)

| File | Kya check karta hai |
|---|---|
| `routes.test.mjs` | Sahi URLs resolve hote hain; galat pages, unknown developers aur ajeeb usernames reject hote hain |
| `developers.test.mjs` | Data helpers sahi posts, bookmarks aur developers dete hain |

Chalane ke liye: `npm test` (Node ka built-in test runner, koi extra package nahi).

## 12. `e2e/` – Browser tests (Playwright, project root mein)

Ye tests asli Chromium browser mein app kholte hain aur user ki tarah click karte hain. Production build pe chalte hain (`playwright.config.mjs` khud build karke server start karta hai).

| File | Kya check karta hai |
|---|---|
| `fixtures.mjs` | Har test mein console error ya hydration error aaye toh test fail. Saath mein helper jo check karta hai ki navigation bina page reload ke hui. |
| `navigation.spec.mjs` | Har page direct khulta hai, sidebar ka sahi link active hota hai, link click pe bina reload page badalta hai, back/forward buttons kaam karte hain |
| `profiles.spec.mjs` | Author ke naam, Explore cards aur suggestions se profile khulta hai; apne profile pe "Edit profile", dusre pe "Follow"; posts na hon toh "No posts yet" |
| `not-found.spec.mjs` | Galat URLs pe 404 page + `noindex`, aur 404 page se wapas app mein jaana |
| `interactions.spec.mjs` | Like button count badhata/ghatata hai, Follow toggle hota hai, Post button disabled hai |
| `mobile.spec.mjs` | Phone size pe sidebars chhupte hain, ☰ menu khulta hai, link click pe page badalta hai aur menu band hota hai, page screen se bahar nahi jaata |

Chalane ke liye: `npm run test:e2e`

---

## Server vs Client Components: simple trick

Jis file ke upar **`"use client"`** likha hai, wo **browser mein chalti hai**, kyunki usme click, state ya menu hai:

- `components/router/app-router.jsx`
- `components/router/app-routes.jsx`
- `components/router/router-links.jsx`
- `components/feed/like-button.jsx`
- `components/layout/follow-button.jsx`
- `components/layout/mobile-nav.jsx`
- `app/[[...slug]]/error.js` (Next.js mein error page hamesha client pe hota hai)

Baaki sab **server pe ban ke aati hain**, isliye page fast load hota hai. 🚀
