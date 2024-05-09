import LayoutWithNavbar from "@/components/LayoutWithNavbar";
import { useRouter } from "next/router";
import UserStatsPageContent from "../../me/MePageContent";

export default function UserStatsPage(): React.ReactElement {
  const router = useRouter();
  const { userId } = router.query;
  return (
    <LayoutWithNavbar
      content={<UserStatsPageContent userId={userId as string} />}
    />
  );
}
