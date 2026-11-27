// Fixed locale so server and client render identical text during hydration.
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value) {
  return compact.format(value);
}
