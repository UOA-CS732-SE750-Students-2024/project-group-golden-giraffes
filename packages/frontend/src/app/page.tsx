import LayoutWithNavbar from "../components/LayoutWithNavbar";
import Main from "./Main";

export default async function Page() {
  return <LayoutWithNavbar content={<Main />} />;
}
