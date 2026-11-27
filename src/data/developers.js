// Every developer on the platform, keyed by a unique username.
// Posts, suggestions and profile pages all reference developers by username.
// The avatar letter is derived from `name` (see lib/avatar.js).
export const developers = [
  {
    username: "jordanlee",
    name: "Jordan Lee",
    role: "Full-stack developer",
    avatarColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    bio: "Building web products end to end. Currently deep into React Server Components and edge runtimes.",
    location: "Bengaluru, India",
    joined: "Joined January 2024",
    skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    followers: 1204,
    following: 318,
  },
  {
    username: "priyacodes",
    name: "Priya Raman",
    role: "Frontend engineer at Lumen",
    avatarColor:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    bio: "Performance nerd. I write about rendering patterns, bundle budgets and design systems.",
    location: "Chennai, India",
    joined: "Joined March 2023",
    skills: ["React", "Next.js", "Performance", "Design Systems"],
    followers: 5230,
    following: 410,
  },
  {
    username: "dokafor",
    name: "Daniel Okafor",
    role: "Backend engineer · Open source",
    avatarColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    bio: "Distributed systems and boring technology that scales. Maintainer of a few Go libraries.",
    location: "Lagos, Nigeria",
    joined: "Joined August 2022",
    skills: ["Go", "PostgreSQL", "System Design", "Kafka"],
    followers: 8912,
    following: 205,
  },
  {
    username: "meilin.dev",
    name: "Mei Lin",
    role: "DevOps lead at Northwind",
    avatarColor:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    bio: "Infrastructure as code, platform engineering and making on-call less painful.",
    location: "Singapore",
    joined: "Joined May 2023",
    skills: ["Terraform", "Kubernetes", "AWS", "DevOps"],
    followers: 3104,
    following: 290,
  },
  {
    username: "sofiabuilds",
    name: "Sofia Martins",
    role: "iOS engineer",
    avatarColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    bio: "Shipping native apps with SwiftUI. Accessibility advocate.",
    location: "Lisbon, Portugal",
    joined: "Joined October 2024",
    skills: ["Swift", "SwiftUI", "Accessibility"],
    followers: 1870,
    following: 164,
  },
  {
    username: "arjunml",
    name: "Arjun Mehta",
    role: "ML engineer",
    avatarColor:
      "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    bio: "Training and serving models in production. Python, PyTorch and lots of GPUs.",
    location: "Pune, India",
    joined: "Joined February 2024",
    skills: ["Python", "PyTorch", "MLOps"],
    followers: 2640,
    following: 233,
  },
  {
    username: "lenaf",
    name: "Lena Fischer",
    role: "Security researcher",
    avatarColor:
      "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
    bio: "Application security, threat modelling and responsible disclosure.",
    location: "Berlin, Germany",
    joined: "Joined June 2023",
    skills: ["AppSec", "Rust", "Threat Modelling"],
    followers: 4015,
    following: 121,
  },
];
