import LayoutWithNavbar from "@/components/LayoutWithNavbar";
import MePageContent from "./Main";

export default function MePage() {
  return <LayoutWithNavbar content={<MePageContent />} />;
}
