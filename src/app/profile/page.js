import { DeveloperProfilePage } from "@/components/pages/developer-profile-page";
import { currentUsername } from "@/data/current-user";

// The signed-in user's own profile.
export default function Page() {
  return <DeveloperProfilePage username={currentUsername} />;
}
