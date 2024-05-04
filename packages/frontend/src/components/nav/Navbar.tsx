"use client";

import { styled } from "@mui/material";
import Link from "next/link";

const Nav = styled("nav")`
  border-block-end: var(--card-border);
  display: grid;
  font-size: 1.35rem;
  gap: 1rem;
  grid-template-columns: auto 1fr;
  justify-content: flex-end;
  padding: 0.5rem 3.5rem;
  place-items: center flex-end;

  a {
    border-radius: 0.125rem;
    color: var(--discord-white);
    padding: 0.5rem 1rem;
    text-decoration: none;
    transition:
      background-color,
      opacity,
      outline-width var(--transition-duration-fast) ease;

    :hover {
      opacity: 55%;
    }

    :focus,
    :focus-visible {
      background-color: oklch(100% 0 0 / 6%);
      outline: var(--focus-outline);
    }
  }
`;

const CompositeLogo = styled(Link)`
  align-items: center;
  color: var(--discord-white);
  display: block flex;
  gap: 1.5rem;
  text-decoration: none;
  user-select: none;
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
