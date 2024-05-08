import LayoutWithNavbar from "@/components/LayoutWithNavbar";
import MePageContent from "./MePageContent";

export default function MePage() {
  return <LayoutWithNavbar content={<MePageContent />} />;
}
