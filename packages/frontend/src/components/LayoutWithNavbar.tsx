import { Navbar } from "@/components";

export default function LayoutWithNavbar({
  content,
}: {
  content: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {content}
    </>
  );
}
