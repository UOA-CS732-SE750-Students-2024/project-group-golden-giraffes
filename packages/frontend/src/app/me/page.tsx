import LayoutWithNavbar from "@/components/LayoutWithNavbar";
import Main from "./Main";

export default function MePage() {
  return <LayoutWithNavbar content={<Main />} />;
}
