// Sample feed content. Authors are referenced by username (see developers.js);
// comments live in comments.js.
// Timestamps are pre-formatted strings so rendering
// stays deterministic (no Date.now() during prerendering).
export const posts = [
  {
    id: "post-1",
    authorUsername: "priyacodes",
    timestamp: "2h",
    content:
      "Finally moved our dashboard to React Server Components. Bundle size dropped 38% and the first load feels instant. The biggest lesson: keep interactivity at the leaves and let the server do the heavy lifting.",
    tags: ["React", "Next.js", "Performance"],
    likes: 128,
    likedByMe: false,
  },
  {
    id: "post-2",
    authorUsername: "dokafor",
    timestamp: "5h",
    content:
      "Hot take: most services don't need a message queue on day one. A Postgres table with SKIP LOCKED has carried our job processing to 2M jobs a day. Reach for Kafka when the numbers tell you to, not before.",
    tags: ["PostgreSQL", "System Design", "Backend"],
    likes: 342,
    likedByMe: true,
  },
  {
    id: "post-3",
    authorUsername: "meilin.dev",
    timestamp: "1d",
    content:
      "Shipped a tiny CLI that diffs Terraform plans across environments and flags drift before it hits production. Looking for early testers and contributors, so drop a comment if you want an invite to the repo.",
    tags: ["Terraform", "DevOps", "Open Source"],
    likes: 76,
    likedByMe: false,
  },
];
