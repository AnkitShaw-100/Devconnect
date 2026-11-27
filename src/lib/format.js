// Fixed locale so server and client render identical text during hydration.
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value) {
  return compact.format(value);
}

const full = new Intl.NumberFormat("en-US");

// Exact count with grouping, e.g. 1871 -> "1,871". Used where a change of
// one must be visible (follower counts after following someone).
export function formatNumber(value) {
  return full.format(value);
}
