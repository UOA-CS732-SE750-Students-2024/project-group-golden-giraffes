import LayoutWithNavbar from "@/components/LayoutWithNavbar";
import UserStatsPageContent, { MePageContent } from "./MePageContent";

export default function MePage() {
  return <LayoutWithNavbar content={<MePageContent />} />;
}
