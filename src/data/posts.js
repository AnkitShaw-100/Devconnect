// Sample feed content. Timestamps are pre-formatted strings so rendering
// stays deterministic (no Date.now() during prerendering).
export const posts = [
  {
    id: "post-1",
    author: {
      name: "Priya Raman",
      username: "priyacodes",
      initials: "PR",
      role: "Frontend engineer at Lumen",
      avatarColor: "bg-rose-100 text-rose-700",
    },
    timestamp: "2h",
    content:
      "Finally moved our dashboard to React Server Components. Bundle size dropped 38% and the first load feels instant. The biggest lesson: keep interactivity at the leaves and let the server do the heavy lifting.",
    tags: ["React", "Next.js", "Performance"],
    likes: 128,
    comments: 24,
    likedByMe: false,
  },
  {
    id: "post-2",
    author: {
      name: "Daniel Okafor",
      username: "dokafor",
      initials: "DO",
      role: "Backend engineer · Open source",
      avatarColor: "bg-emerald-100 text-emerald-700",
    },
    timestamp: "5h",
    content:
      "Hot take: most services don't need a message queue on day one. A Postgres table with SKIP LOCKED has carried our job processing to 2M jobs a day. Reach for Kafka when the numbers tell you to, not before.",
    tags: ["PostgreSQL", "System Design", "Backend"],
    likes: 342,
    comments: 87,
    likedByMe: true,
  },
  {
    id: "post-3",
    author: {
      name: "Mei Lin",
      username: "meilin.dev",
      initials: "ML",
      role: "DevOps lead at Northwind",
      avatarColor: "bg-amber-100 text-amber-800",
    },
    timestamp: "1d",
    content:
      "Shipped a tiny CLI that diffs Terraform plans across environments and flags drift before it hits production. Looking for early testers and contributors, so drop a comment if you want an invite to the repo.",
    tags: ["Terraform", "DevOps", "Open Source"],
    likes: 76,
    comments: 15,
    likedByMe: false,
  },
];
