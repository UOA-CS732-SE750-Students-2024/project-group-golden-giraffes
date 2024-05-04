"use client";

import { styled } from "@mui/material";
import Link from "next/link";

const Nav = styled("nav")`
  border-block-end: oklch(100% 0 0 / 15%) solid 3px;
  display: grid;
  font-size: 1.5rem;
  gap: 1rem;
  grid-template-columns: auto 1fr;
  justify-content: flex-end;
  padding: 1rem 3.5rem;
  place-items: center flex-end;
`;

const CompositeLogo = styled("div")`
  align-items: center;
  display: flex;
  gap: 1.5rem;
  user-select: none;
`;

const Wordmark = styled("div")`
  color: var(--discord-white);
  font-variation-settings: "wdth" 125;
  font-weight: 900;
  text-decoration: none;
`;

export default function Navbar() {
  return (
    <Nav>
      <Link href="/">
        <CompositeLogo>
          <img
            alt="Blurple Canvas logo"
            src="/images/blurple-canvas-logo~dark.svg"
            width={28}
            height={28}
          />
          <Wordmark>Blurple Canvas</Wordmark>
        </CompositeLogo>
      </Link>
      <a href="/">Sign out</a>
    </Nav>
  );
}
