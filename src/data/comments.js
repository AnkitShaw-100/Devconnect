// Sample comments, keyed by post id, oldest first. Authors are referenced by
// username (see developers.js). The comment count shown on a post is the
// length of its list.
export const commentsByPostId = {
  "post-1": [
    {
      id: "c-1-1",
      authorUsername: "dokafor",
      timestamp: "1h",
      content: "38% is huge. Did you have to rethink how you fetch data per component?",
    },
    {
      id: "c-1-2",
      authorUsername: "priyacodes",
      timestamp: "45m",
      content: "Yes! Fetching moved next to the components that need it, and most client state disappeared.",
    },
    {
      id: "c-1-3",
      authorUsername: "sofiabuilds",
      timestamp: "20m",
      content: "Bookmarking this for our dashboard rewrite.",
    },
  ],
  "post-2": [
    {
      id: "c-2-1",
      authorUsername: "meilin.dev",
      timestamp: "4h",
      content: "Agreed. We ran SKIP LOCKED queues for two years before needing anything else.",
    },
    {
      id: "c-2-2",
      authorUsername: "arjunml",
      timestamp: "3h",
      content: "How do you handle retries and dead letters with that setup?",
    },
  ],
  "post-3": [
    {
      id: "c-3-1",
      authorUsername: "lenaf",
      timestamp: "20h",
      content: "Happy to test this. Drift detection is a big gap in our pipeline.",
    },
  ],
};
