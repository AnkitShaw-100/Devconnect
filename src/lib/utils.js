export { cn } from "cn"

// Space-separated element ids for aria-describedby / aria-labelledby,
// skipping empty ones. (cn() is for class names: it merges Tailwind classes.)
export function idList(...ids) {
  return ids.filter(Boolean).join(" ") || undefined
}
