"use client";

import { Navbar } from "@/components/nav";

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
