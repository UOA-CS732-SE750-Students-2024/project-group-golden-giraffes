"use client";

import { styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { CanvasPicker } from "../canvas";
import NavLinks from "./NavLinks";

const Nav = styled("nav")`
  background-color: var(--discord-legacy-dark-but-not-black);
  border-block-end: var(--card-border);
  display: grid;
  font-size: 1.35rem;
  gap: 0.5rem;
  grid-template-columns: auto 1fr auto;
  justify-content: flex-end;
  padding-block: 0.5rem;
  place-items: center;

  ${({ theme }) => theme.breakpoints.up("md")} {
    gap: 1rem;
    padding-inline: 4rem;
  }

  a {
    border-radius: 0.5rem;
    color: var(--discord-white);
    padding: 0.5rem 1rem;
    text-decoration: none;
    transition:
      background-color var(--transition-duration-fast) ease,
      opacity var(--transition-duration-fast) ease,
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
  display: none;
  font-variation-settings: "wdth" 125;
  font-weight: 900;
  text-decoration: none;

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: block;
  }
`;

const Logo = styled(Image)`
  min-width: ${(props) => props.width}px;
  min-height: ${(props) => props.height}px;
`;

export default function Navbar() {
  return (
    <Nav>
      <CompositeLogo href="/">
        <Logo
          alt="Blurple Canvas logo"
          src="/images/blurple-canvas-logo~dark.svg"
          width={28}
          height={28}
        />
        <Wordmark>Blurple Canvas</Wordmark>
      </CompositeLogo>
      <CanvasPicker />
      <NavLinks />
    </Nav>
  );
}
