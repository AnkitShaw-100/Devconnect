import { notFound } from "next/navigation";
import { DeveloperProfilePage } from "@/components/pages/developer-profile-page";
import { findDeveloperByParam, getAllDevelopers } from "@/lib/developers";

// Every known developer is prerendered at build time. Any other username is
// rendered on its first request, where it hits notFound() below.
export function generateStaticParams() {
  return getAllDevelopers().map(({ username }) => ({ username }));
}

export default async function Page({ params }) {
  const { username } = await params;

  // The param comes from the URL: validate it before using it.
  const developer = findDeveloperByParam(username);
  if (!developer) notFound();

  return <DeveloperProfilePage username={developer.username} />;
}
