import { ProfileSkeleton } from "@/components/profile/profile-skeleton";

// Profiles not prerendered at build (any new username) render on request;
// this profile-shaped skeleton shows meanwhile, instead of the generic one.
export default function Loading() {
  return <ProfileSkeleton />;
}
