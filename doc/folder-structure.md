# DevConnect – `src` Folder Structure

`src` folder ke andar kya hai aur kaunsi file kya karti hai, iska simple guide. (Updated: Milestone 4 — UI polish aur accessibility ke baad.)

## Overall structure

```
src/
├── app/                     → Har folder = ek URL (Next.js file-based routing)
│   ├── layout.js            → Poore app ka frame: navbar + sidebars, dark theme on
│   ├── globals.css          → Saare theme colours (ek hi jagah)
│   ├── page.js              → /
│   ├── explore/page.js      → /explore
│   ├── bookmarks/page.js    → /bookmarks
│   ├── profile/page.js      → /profile
│   ├── developers/
│   │   └── [username]/page.js → /developers/kuch-bhi-username
│   ├── not-found.js         → 404 page
│   ├── loading.js           → Loading skeleton
│   ├── error.js             → Error page (layout ke andar)
│   └── global-error.js      → Root layout hi fail ho jaaye tab ka error page
├── components/              → UI ke saare chhote-bade tukde
│   ├── providers/           → Shared state: likes, follows, bookmarks, comments, naye posts
│   ├── layout/              → Navbar, sidebars, nav links, user menu, follow button
│   ├── feed/                → Post card ke hisse, comments, menus, dialogs, create-post form
│   ├── profile/             → Profile ke client hisse (stats, posts)
│   ├── developers/          → Developer cards (Explore page ke liye)
│   ├── pages/               → Har route ka asli content
│   ├── shared/              → Baar-baar use hone wale chhote components
│   └── ui/                  → shadcn ke components
├── data/                    → Dummy data (posts, comments, developers)
└── lib/                     → Helpers: data, URLs, avatar letter, form validation, interaction store, a11y

tests/                       → Unit tests (project root mein)
e2e/                         → Browser tests, Playwright (project root mein)
```

Ek line mein: **`app` ka folder structure hi URL hai, `data` mein content hai, `lib` usse padhta hai, `components` mein design hai, `globals.css` mein rang hain.**

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

- Har page isi ke andar dikhta hai. Isme `<InteractionsProvider>` (shared state) aur `<AppShell>` (navbar, left sidebar, right sidebar) hain.
- Page badalne pe **layout dobara nahi banta**, sirf beech wala content (`children`) badalta hai. Isliye sidebar ka Follow state navigation ke baad bhi bana rehta hai.
- Fonts: Geist (text), Geist Mono (code), aur **Noto Color Emoji**, taaki emoji har OS pe ek jaise colorful dikhein (Windows ka default emoji font flat hai). Emoji font pehle se load nahi hota, sirf jab koi emoji dikhe.
- `<html>` pe `dark` class lagi hai, isliye **poora app by default dark theme** mein hai. `scheme-dark` se browser ke scrollbars aur inputs bhi dark ho jaate hain. Abhi koi theme toggle nahi hai.

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

### `app/developers/[username]/loading.js`

Profile ki shape wala skeleton (banner, gol avatar, naam, stats), jab koi naya profile server pe ban raha ho.

### `app/global-error.js`

Agar **root layout hi** (navbar, sidebars, provider) fail ho jaaye, toh `error.js` use nahi pakad sakta. Tab ye page aata hai. Ye apna `<html>`, `<body>`, CSS aur dark theme khud lagata hai, aur sirf saade HTML elements use karta hai (agar shared components hi toote hon). Buttons: Try again, Reload page.

### `app/error.js`

Page banate waqt error aaye toh beech wale column mein "Something went wrong" card, **Try again** aur **Go to home** ke saath. Error ki details sirf console mein jaati hain.

> Dhyan do: `error.js` layout ke andar ke errors pakadta hai, **layout ke khud ke** errors nahi. Uske liye Next.js mein alag `global-error.js` hota hai (abhi nahi banaya).

### `app/globals.css` 🎨 (saare rang yahin)

Global styling: Tailwind, theme colours aur font. Rangon ke liye neeche wala section **"Theme colours kahan rehte hain"** dekho.

---

## 2. `components/layout/` – Page ka dhaancha

| File | Kya karti hai |
|---|---|
| `app-shell.jsx` | 3-column layout: left sidebar, beech mein content, right sidebar. Sabse upar "Skip to main content" link (Tab dabate hi dikhta hai). `<main id="main-content">` pe focus aa sakta hai. Phone pe neeche bottom tab bar ki jagah chhodi jaati hai. |
| `bottom-nav.jsx` | Phone pe neeche fixed tab bar: Home, Explore, Bookmarks, Profile, current tab highlight. `md` se bade screens pe chhupa rehta hai. |
| `nav-link.jsx` | Nav ka link, do `variant`: `sidebar` (icon + label ek line mein) aur `tab` (icon ke neeche chhota label, bottom bar). `usePathname()` se active link **blue highlight**. (Client Component) |
| `navbar.jsx` | Upar ki bar: logo, **beech mein** search, notification bell, avatar. Bade screens pe 3-column grid (`1fr`, search, `1fr`), isliye search hamesha center mein. |
| `user-menu.jsx` | Navbar avatar ka dropdown: naam, My profile / Bookmarks / Explore links, Settings aur Sign out (disabled, auth abhi nahi). Keyboard se chalta hai. |
| `logo.jsx` | Blue box wala `</>` icon + "DevConnect" naam (click → Home) |
| `search-bar.jsx` | Search box with search icon |
| `mobile-nav.jsx` | Mobile pe ☰ button, jo left se menu slide karke kholta hai. Link click karo toh band ho jaata hai. |
| `sidebar.jsx` | Left side: profile card (naam click → `/profile`) + Home/Explore/Bookmarks/Profile links |
| `right-sidebar.jsx` | Right side ke 3 cards: Trending technologies, Suggested developers (naam click → unka profile), Community stats |
| `follow-button.jsx` | Follow / Following. State shared store mein, username se, isliye sidebar, Explore aur profile ke buttons sync rehte hain. "Following" pe hover/focus karo toh "Unfollow" dikhta hai. |

**`nav-link.jsx` mein `<Suspense>` kyun hai?** Cache Components on hone par, agar URL ka username build ke time pata nahi tha (jaise `/developers/nobody`), toh `usePathname()` server pe ruk (suspend) jaata hai. `<Suspense>` us waqt bina highlight wala same link dikha deta hai, taaki baaki layout ban sake. Iske bina build fail hota hai.

---

## 3. `components/feed/` – Posts wala hissa

| File | Kya karti hai |
|---|---|
| `post-card.jsx` | Post card, chhote hisson se bana: `PostHeader` (author + "…" menu), `PostBody` (text mein **#hashtags blue**, images grid), `PostTags` (sirf wo tags jo text mein nahi hain), aur `PostActions`. Khud mein koi hook nahi, isliye server **aur** client dono jagah render ho sakta hai. |
| `post-actions.jsx` | Post ka interactive hissa (client island): Like, Comments, Bookmark, Share. Comment button comments panel kholta/band karta hai. |
| `like-button.jsx` ❤️ | Like/unlike. State shared store mein, isliye same post har page pe same dikhta hai. |
| `bookmark-button.jsx` | Bookmark lagana/hatana; Bookmarks page turant badal jaata hai |
| `comment-section.jsx` | Comments ki list (avatar, naam, time, text) + neeche form |
| `comment-form.jsx` | Comment likhne ka form: live character count (max 300), validation, `Ctrl+Enter` se bhejna |
| `post-menu.jsx` | "…" dropdown: Bookmark, author ka profile, Report post (dusron ke post) ya Delete post (apne post) |
| `share-dialog.jsx` | Share dialog: post ka link aur Copy button |
| `report-dialog.jsx` | Report form dialog: reason (radio, zaroori), details ("Something else" pe zaroori) |
| `delete-post-dialog.jsx` | "Delete this post?" confirm (alert dialog: bahar click karke band nahi hota) |
| `create-post.jsx` | Post likhne ka form, X jaisa: border-less bada text box, neeche toolbar mein **Media** (max 4 images, preview aur hatane ka button) aur **Emoji**, likhte waqt hi count (max 500), gol Post button. Hashtags text mein hi likhte hain (`#React`), wahi post ke tags bante hain (max 5). Sirf image wala post bhi chalta hai. `Ctrl+Enter` se post. Focus card ke ring se dikhta hai. |
| `emoji-picker.jsx` | Emoji button + popover grid (40 emoji). Cursor ki jagah emoji daalta hai, phir focus wapas text box pe. Har emoji ka naam screen reader ko sunai deta hai. |
| `new-posts.jsx` | User ke is session ke likhe posts (client), wahi `PostCard` use karke |
| `bookmarked-posts.jsx` | Bookmarks page pe sirf bookmarked posts dikhata hai (client filter, server-rendered cards) |
| `post-card-skeleton.jsx` | Loading ke time post card ki jagah grey placeholder |

---

## 4. `components/developers/`

| File | Kya karti hai |
|---|---|
| `developer-card.jsx` | Chhota developer card: avatar, naam (click → profile), role, top 3 skills, Follow button. Explore page pe grid mein dikhta hai. |

---

## 4b. `components/profile/` aur `components/providers/`

| File | Kya karti hai |
|---|---|
| `profile/profile-stats.jsx` | Profile ke inline stats (Following, Followers, Posts). Follow karo toh followers +1, apna post likho toh posts +1. |
| `profile/profile-posts.jsx` | Server pe bane posts `children` ki tarah leta hai, apne profile pe naye posts upar jodta hai, aur dono khaali hon toh empty state |
| `profile/profile-skeleton.jsx` | Profile header ki shape ka loading skeleton |
| `providers/interactions-provider.jsx` | Poore app ka shared state (likes, follows, bookmarks, comments, naye posts) aur screen-reader announcer (`useAnnounce`). Root layout mein hai. |

---

## 5. `components/pages/` – Har route ka asli content

| File | Kya karti hai |
|---|---|
| `home-page.jsx` | "Welcome back, Jordan" + create post + feed |
| `explore-page.jsx` | Trending topics, "Developers to follow" grid, "Popular this week" posts |
| `bookmarks-page.jsx` | Saved posts. Kuch saved nahi hai toh "No bookmarks yet". |
| `developer-profile-page.jsx` | Profile page, social-profile layout mein: lamba banner (3:1), bada avatar (128px) jo banner ke kinare pe latakta hai, right side pe "Edit profile" (disabled) ya "Follow", bada naam, @username, bio, role/location/joined, aur inline stats. Phir skills aur posts. |
| `not-found-page.jsx` | "Page not found" + Home aur Explore ke buttons |

`app/` ki `page.js` files patli hain aur asli design yahan hai. Isse `app/` mein sirf routing dikhti hai.

---

## 6. `components/shared/` – Reusable chhote parts

| File | Kya karti hai |
|---|---|
| `action-button.jsx` | Post ke Like/Comment/Bookmark/Share ka **ek reusable button**: icon + label/count, `active` hone pe rang aur bhara icon |
| `page-header.jsx` | Har page ke upar title + chhota description |
| `page-skeleton.jsx` | Loading ke time beech wale column ka skeleton (`app/loading.js` use karta hai) |
| `empty-state.jsx` | Icon + message wala card, jab dikhane ko kuch na ho (no bookmarks, no posts, 404, error) |
| `user-avatar.jsx` | Gol avatar jisme naam ka **pehla letter** hota hai (jaise "Priya Raman" → "P"). Letter `lib/avatar.js` se aata hai. |
| `tech-tag.jsx` | `#React`, `#DevOps` jaise chhote tags |

---

## 7. `components/ui/` – shadcn components

Button, Card, Avatar, Badge, Input, Sheet, Separator, Dialog, Dropdown Menu, Skeleton. Ye shadcn/ui se aaye hain aur baaki components inhe use karte hain.

Milestone 3 mein add kiye (shadcn ke style mein, koi naya package nahi):
- `textarea.jsx`: multi-line field, Input jaisa
- `alert-dialog.jsx`: confirm dialogs ke liye (Base UI `AlertDialog`, `role="alertdialog"`)
- `dropdown-menu.jsx` mein `DropdownMenuLinkItem`: menu ka item jo asli link hai

**Avatar ka size:** custom size (`size-24` jaisa) chahiye toh `size="lg"` mat do. `size="lg"` ki `data-[size=lg]:size-10` class plain `size-*` se strong hai aur tumhara size ignore ho jaata hai.

---

## 8. `data/` – Fake data (UI se alag)

| File | Kya hai |
|---|---|
| `developers.js` | Saare 7 developers: naam, username, role, bio, location, skills, followers, avatar ka rang (light + `dark:` shade). Initials ab store nahi hote, avatar letter `name` se banta hai. **Baaki sab files developers ko username se refer karti hain.** |
| `posts.js` | 3 sample posts. Har post mein bas `authorUsername` hai, poora author nahi. |
| `comments.js` | Har post ke sample comments. Post pe dikhne wali comment ginti isi list ki lambai hai. |
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
| `avatar.js` | `getAvatarLetter(name)`: first name ka pehla letter, capital mein. Details neeche wale section mein. |
| `interactions.js` | Shared store ka **reducer** (pure function): like, follow, bookmark, comment add, post create/delete. Unit tested. |
| `validation.js` | Forms ki validation: `validatePost` (text ya image zaroori, hashtags max 5), `validateImages` (sirf images, max 4, 5 MB tak), `validateComment`, `validateReport`. Hashtags ke liye `extractHashtags` aur highlight ke liye `splitHashtags`. Har ek cleaned `values` aur `errors` lautata hai. Backend aane pe server pe bhi yahi checks chalne chahiye. |
| `a11y.js` | Accessibility helpers: `MAIN_CONTENT_ID`, aur `focusMainContent()` / `isFocusLost()`, jo focused cheez page se hat jaaye (post delete, bookmark hata) toh focus main content pe le aate hain |
| `format.js` | `formatCount`: `1200` → `1.2K`. `formatNumber`: `1871` → `1,871` (profile stats, taaki follow karne pe +1 dikhe). |
| `utils.js` | `cn` (CSS classes jodna) aur `idList` (`aria-describedby` ke liye ids jodna) |

---

## 10. `tests/` – Unit tests (project root mein)

| File | Kya check karta hai |
|---|---|
| `routing.test.mjs` | Har URL ke liye `page.js` file hai; galat usernames reject hote hain; har developer ka username valid hai; active link ka logic sahi hai |
| `avatar.test.mjs` | Avatar letter: normal naam, single naam, extra spaces, lowercase, khaali input, `ß`, alag accent, emoji, aur `Intl.Segmenter` na ho tab bhi; data mein `initials` nahi bacha |
| `theme.test.mjs` | `globals.css` aur Tailwind ke asli colour values se **WCAG contrast** calculate karta hai: text, tags, blue accent, har component ka focus ring, like/trend colours aur har avatar |
| `developers.test.mjs` | Data helpers sahi posts, bookmarks, developers aur comments dete hain |
| `validation.test.mjs` | Post, comment aur report forms ke saare rules: khaali, bahut lamba, galat tags, "Something else" bina details |
| `design-system.test.mjs` | Design system ke guards: components mein hard-coded neutral/blue rang nahi; custom avatar size ke saath `size="lg"` nahi; `outline-hidden` ke focus outline mein `outline-solid` zaroori; hooks wali file pe `"use client"` |
| `interactions.test.mjs` | Store reducer: like/unlike, follow, bookmark, comment, apna post banana/delete karna, data ke post delete na ho paana |

Chalane ke liye: `npm test` (Node ka built-in test runner, koi extra package nahi).

## 11. `e2e/` – Browser tests (Playwright, project root mein)

Ye tests asli Chromium browser mein app kholte hain aur user ki tarah click karte hain. Production build pe chalte hain (`playwright.config.mjs` khud build karke server start karta hai).

| File | Kya check karta hai |
|---|---|
| `global-setup.mjs` | Tests se pehle har route ek baar khol ke server "warm up" karta hai, taaki pehle tests cold start ki wajah se timeout na hon |
| `fixtures.mjs` | Har test mein console error ya hydration error aaye toh test fail. Har `page.goto` ke baad React ke hydrate hone (`<html data-hydrated>`) ka wait, taaki click kho na jaaye. Navigation bina reload hui ya nahi, uska helper. |
| `navigation.spec.mjs` | Har page direct khulta hai, sahi link active hota hai, bina reload page badalta hai, back/forward, scroll karne ke baad naya page upar se dikhta hai, layout ka state navigation mein bana rehta hai |
| `profiles.spec.mjs` | Author, Explore cards aur suggestions se profile khulta hai; encoded username (`meilin%2Edev`); Follow vs Edit profile; "No posts yet" |
| `not-found.spec.mjs` | Galat URLs pe 404 page + `noindex`, aur 404 page se wapas app mein jaana |
| `interactions.spec.mjs` | Like button count badhata/ghatata hai, Follow toggle hota hai, Post button text likhne pe hi enable hota hai |
| `posts.spec.mjs` | Post likhna (hashtags highlight, validation, `Ctrl+Enter`, profile pe dikhna), composer ka emoji picker aur images (attach, hatana, sirf image wala post, galat file, 4 se zyada), apna post delete karna, comments (padhna, likhna, ginti har page pe), likes aur bookmarks pages ke beech sync, Share aur Report dialogs |
| `follow-and-menus.spec.mjs` | Follow har jagah sync aur followers +1, hover pe "Unfollow", account menu aur post menu keyboard se |
| `mobile.spec.mjs` | Phone size pe sidebars chhupte hain, ☰ menu khulta hai, link click pe page badalta hai aur menu band hota hai, bottom tab bar navigate karta hai aur aakhri post uske peeche nahi chhupta |
| `accessibility.spec.mjs` | Skip link, post delete aur bookmark hatane ke baad focus aur announcement, menu items ka keyboard outline, empty states ke buttons, har button/link ka naam |
| `theme.spec.mjs` | Dark theme on hai, background aur cards theme tokens se aate hain, inputs ka background sahi token se aata hai, banner pe avatar ka fill solid hai, active link brand colour mein hai, har avatar mein sirf ek letter hai, profile avatar bada (96px+) aur banner pe overlap, navbar search center mein |

Chalane ke liye: `npm run test:e2e`

---

## 🎨 Theme colours kahan rehte hain

**Saare rang ek hi jagah hain: `src/app/globals.css`.** Components mein ab `bg-white`, `text-neutral-900`, `bg-blue-50` jaise fixed rang nahi likhe; wo **theme tokens** use karte hain.

```
globals.css
├── :root { ... }     → Light theme ke rang (abhi use nahi ho rahe, future toggle ke liye)
├── .dark { ... }     → Dark theme ke rang (shadcn ka palette) ← abhi yahi chalta hai
└── @theme inline     → In variables ko Tailwind classes banata hai (bg-card, text-foreground...)
```

`layout.js` mein `<html className="dark">` hai, isliye `.dark` wale rang lagte hain.

| Token (Tailwind class) | Kahan use hota hai |
|---|---|
| `bg-background` | Page ka background, navbar |
| `bg-card` | Cards (posts, sidebar boxes) |
| `bg-muted` | Hover, search box, cover band, stat tiles, skeleton |
| `text-foreground` | Main text, headings, naam |
| `text-muted-foreground` | Chhota/secondary text: @username, time, labels |
| `border-border` | Lines aur borders |
| `ring-ring` | Keyboard focus ring |
| `bg-brand` / `text-brand-foreground` | Blue logo box (DevConnect ka apna token) |
| `bg-brand-soft` / `text-brand-soft-foreground` | Active nav link, blue icons, empty-state icon (DevConnect ka apna token) |

**Brand tokens kyun banaye?** Shadcn ke palette mein blue accent nahi hai. Isliye `globals.css` mein 3 chhote tokens add kiye (`--brand`, `--brand-soft`, `--brand-soft-foreground`), light aur dark dono ke liye. `.dark` ke shadcn wale rang waise hi hain.

**Kuch rang abhi bhi `dark:` ke saath likhe hain**, kyunki wo ek-ek jagah hi use hote hain:
- Avatar ke rang (`data/developers.js`): light mein `bg-rose-100 text-rose-700`, dark mein `dark:bg-rose-950 dark:text-rose-300`. Dark fill **solid** (`-950`) hai, transparent nahi, kyunki sidebar aur profile page pe avatar banner aur card dono ke upar aata hai. Transparent hota toh upar-neeche do alag shade dikhte.
- Like ka laal dil (`dark:text-rose-400`) aur trending ka hara % (`dark:text-emerald-400`)

**Contrast check:** `tests/theme.test.mjs` asli colour values se WCAG ratio nikalta hai. Text ke liye kam se kam 4.5:1, icons aur focus ring ke liye 3:1. Isi test ne dikhaya ki aadhe transparent focus indicators dark mein fail hote hain: `ring-ring/50` ~1.9:1, `ring-destructive/40` 1.95:1, aur `globals.css` ka global `outline-ring/50` 1.87:1. Isliye ab **saare** focus indicators solid hain: har component ka `ring-ring` / `ring-destructive` (shadcn Button, Input, Badge bhi) aur global `outline-ring`. Test har component file aur `globals.css` ke focus ring/outline ko unki asli opacity pe, har surface (background, card, muted, popover, active link ka tint) pe check karta hai. Koi faint ring wapas aaye toh test fail ho jaayega.

**Inputs ka ek pecha:** shadcn `Input` ki apni class `dark:bg-input/30` hai, jo dark mode mein plain `bg-muted` se zyada strong hai. Isliye search box aur create-post input pe `dark:bg-muted` jaisa `dark:` override bhi likha hai, warna unka rang lagta hi nahi.

**Naya rang chahiye?** Component mein fixed rang mat likho. `globals.css` mein token add karo (`:root` aur `.dark` dono mein), `@theme inline` mein map karo, phir class use karo.

---

## 🔤 Avatar letter kaise banta hai

Avatar mein **sirf first name ka pehla letter** dikhta hai, capital mein. Middle ya last name kabhi use nahi hota.

Ye kaam ek hi function karta hai, `src/lib/avatar.js` ka `getAvatarLetter(name)`:

1. Naam ke aage-peeche ke spaces hatao (`trim`)
2. Spaces pe tod ke pehla shabd lo (first name). Extra spaces ya tab ho toh bhi chalega.
3. Uska pehla **dikhne wala character** lo. Ye `Intl.Segmenter` se hota hai, taaki 👩‍💻 jaisa emoji ya alag se laga accent (e + ´) na toote. Purane browsers (jaise Firefox 125 se pehle) mein `Intl.Segmenter` nahi hota, wahan pehla code point liya jaata hai. Segmenter zaroorat pe hi banta hai, module load pe nahi, taaki aise browser mein page crash na ho.
4. Capital karo. Par agar capital karne se ek se zyada letter ban jaayein (jaise `ß` → `SS`), toh original letter hi rakho, kyunki avatar mein hamesha **ek hi** character dikhna chahiye.

| Naam | Letter |
|---|---|
| `"Priya Raman"` | `P` |
| `"Jordan Lee"` | `J` |
| `"   daniel   okafor "` | `D` |
| `"Madonna"` | `M` |
| `"ßtefan"` | `ß` (`SS` nahi) |
| `"👩‍💻 Dev"` | `👩‍💻` |
| `""` ya kuch nahi | `?` |

`components/shared/user-avatar.jsx` isi function ko call karta hai, aur **har avatar** (navbar, sidebar, post cards, create-post, suggestions, Explore cards, profile page) isi component se banta hai. Isliye rule ek jagah badlo, har jagah lag jaata hai. Data mein ab `initials` field nahi hai.

---

## 🧩 Design system (ek jaisa UI kaise rehta hai)

**1. Rang:** sirf theme tokens (`bg-card`, `text-muted-foreground`, `bg-brand-soft`...). Saare rang `globals.css` mein. Upar wala "Theme colours" section dekho.

**2. Typography:**

| Cheez | Class |
|---|---|
| Page title (h1) | `text-2xl font-semibold tracking-tight` (`PageHeader`) |
| Profile naam | `text-xl sm:text-2xl font-bold` |
| Card title | `font-semibold` (`CardTitle`) |
| Post text / bio | `text-[15px] leading-relaxed` |
| Meta (username, time) | `text-xs` ya `text-sm` + `text-muted-foreground` |

**3. Shapes aur spacing:** cards `rounded-xl` + `shadow-xs`, card ke andar `px-4 sm:px-5`, cards ke beech `space-y-4`. Buttons: actions ke liye `rounded-full` (Post, Follow, Edit profile), baaki shadcn default.

**4. Reusable components (naya UI banane se pehle yahi use karo):**

| Zaroorat | Component |
|---|---|
| Page ka title | `PageHeader` |
| Kuch dikhane ko nahi | `EmptyState` (icon, title, description, aur aage ka button) |
| Loading | `PageSkeleton`, `ProfileSkeleton`, `PostCardSkeleton` |
| Post ka action (like jaisa) | `ActionButton` |
| Avatar | `UserAvatar` (custom size ke saath `size="lg"` mat do) |
| Tag | `TechTag` |
| Confirm | `AlertDialog` |

**5. Accessibility rules:**
- Har button/link ka naam ho (icon-only pe `aria-label`).
- Focus hamesha dikhe: solid `ring-ring` / `outline-ring`, kabhi `/50` jaisa faint nahi.
- Koi cheez hatao jisme focus tha → `focusMainContent()` + `announce()`.
- Dialogs band hone pe focus wapas trigger pe (`finalFocus`).
- Errors field se jude: `aria-invalid` + `aria-describedby`.

Ye rules `tests/design-system.test.mjs`, `tests/theme.test.mjs` aur `e2e/accessibility.spec.mjs` mein check hote hain, taaki dobara na tootein.

---

## Server vs Client Components: simple trick

Jis file ke upar **`"use client"`** likha hai, wo **browser mein chalti hai**, kyunki usme click, state, menu ya current URL ki zaroorat hai:

- `components/providers/interactions-provider.jsx` (shared state)
- `components/layout/`: `nav-link`, `mobile-nav`, `follow-button`, `user-menu` (`bottom-nav` server hai, andar `nav-link` client)
- `components/feed/`: `emoji-picker`, `post-actions`, `like-button`, `bookmark-button`, `comment-form`, `post-menu`, `share-dialog`, `report-dialog`, `delete-post-dialog`, `create-post`, `new-posts`, `bookmarked-posts`
- `components/profile/`: `profile-stats`, `profile-posts`
- `app/error.js` aur `app/global-error.js` (Next.js mein error pages hamesha client pe hote hain)

Baaki sab **server pe ban ke aati hain**: pages, layout, `PostCard`, header, sidebars, empty states. 🚀

### Server aur Client ko jodne ke 4 tareeke (component composition)

1. **Client island:** `PostCard` (server) apne andar `PostActions` (client) rakhta hai aur use sirf zaroori data deta hai. Post ka baaki HTML server pe banta hai.
2. **Server `children` client ke andar:** `InteractionsProvider` (client) poore app ko wrap karta hai, phir bhi uske `children` (pages) Server Components rehte hain. `ProfilePosts` bhi server pe bane posts ko `children` ki tarah leta hai.
3. **Server elements props mein:** `BookmarksPage` (server) har post ka card bana ke `BookmarkedPosts` (client) ko deta hai. Client sirf decide karta hai ki kaun sa card dikhana hai.
4. **Hook-free shared component:** `PostCard`, `ActionButton` aur `CommentSection` mein koi hook nahi, isliye server aur client dono jagah chalte hain. `NewPosts` (client) wahi `PostCard` use karta hai jo feed (server) karta hai.

**Shared state kyun?** Likes, follows, bookmarks aur comments `InteractionsProvider` mein rehte hain, jo root layout mein hai aur navigation pe remount nahi hota. Isliye Home pe like karo toh Explore pe bhi liked dikhta hai. Abhi kuch save nahi hota: page reload karo toh sab reset.

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
