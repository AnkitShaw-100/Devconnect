import { notFound } from "next/navigation";
import { RouteTree } from "@/components/router/route-tree";
import { getKnownRouteSlugs, resolveRoute } from "@/lib/routes";

// Every URL lands on this one Next.js page (optional catch-all segment), and
// React Router decides what to show. Known URLs are prerendered at build.
export function generateStaticParams() {
  return getKnownRouteSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug = [] } = await params;

  // Validate on the server: unknown pages and developers get the 404 page.
  if (!resolveRoute(slug)) notFound();

  return <RouteTree location={`/${slug.join("/")}`} />;
}
