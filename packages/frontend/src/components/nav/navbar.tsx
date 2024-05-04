"use client";

import { styled } from "@mui/material";

const Nav = styled("nav")`
  border-block-end: oklch(100% 0 0 / 15%) solid 3px;
  display: grid;
  font-size: 1.5rem;
  gap: 1rem;
  grid-template-columns: auto 1fr;
  justify-content: flex-end;
  padding-block: 1rem;
  padding-inline: 3.5rem;
  place-items: center flex-end;
`;

const CompositeLogo = styled("div")`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const Wordmark = styled("div")`
  font-weight: 900;
  font-variation-settings: "wdth" 125;
`;

const SignOutLink = styled("a")``;

export default function Navbar() {
  return (
    <Nav>
      <CompositeLogo>
        <img
          alt="Blurple Canvas logo"
          src="/images/blurple-canvas-logo~dark.svg"
          width={28}
          height={28}
        />
        <Wordmark>Blurple Canvas</Wordmark>
      </CompositeLogo>
      <SignOutLink>Sign out</SignOutLink>
    </Nav>
  );
}
