import { RouteTree } from "@/components/router/route-tree";

export const metadata = {
  title: "Page not found · DevConnect",
};

// Rendered when the catch-all page calls notFound(). "/404" matches no route,
// so React Router shows its not-found view on the server, and the browser
// router reaches the same view for the real URL, so hydration lines up.
export default function NotFound() {
  return <RouteTree location="/404" />;
}
