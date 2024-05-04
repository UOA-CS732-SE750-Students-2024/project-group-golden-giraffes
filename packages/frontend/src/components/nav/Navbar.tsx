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

const CompositeLogo = styled(Link)`
  align-items: center;
  color: var(--discord-white);
  display: block flex;
  gap: 1.5rem;
  text-decoration: none;
  user-select: none;
  transition:
    opacity,
    font-variation-settings var(--transition-duration-fast) ease;

  :hover {
    opacity: 55%;
  }
`;

const Wordmark = styled("div")`
  font-variation-settings: "wdth" 125;
  font-weight: 900;
  text-decoration: none;
`;

export default function Navbar() {
  return (
    <Nav>
      <CompositeLogo href="/">
        <img
          alt="Blurple Canvas logo"
          src="/images/blurple-canvas-logo~dark.svg"
          width={28}
          height={28}
        />
        <Wordmark>Blurple Canvas</Wordmark>
      </CompositeLogo>
      <a href="/">Sign out</a>
    </Nav>
  );
}
