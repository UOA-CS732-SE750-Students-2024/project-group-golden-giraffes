"use client";

import { styled } from "@mui/material";
import Link from "next/link";
import { CanvasPicker } from "../canvas";

const Nav = styled("nav")`
  background-color: var(--discord-legacy-dark-but-not-black);
  border-block-end: var(--card-border);
  display: grid;
  font-size: 1.35rem;
  gap: 1rem;
  grid-template-columns: auto 1fr auto;
  justify-content: flex-end;
  padding: 0.5rem 4rem;
  place-items: center;

  a {
    border-radius: 0.125rem;
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
  font-variation-settings: "wdth" 125;
  font-weight: 900;
  text-decoration: none;
`;

const Links = styled("ul")`
  display: flex;
  list-style-type: none;

  /*
   * Workaround for accessibility issue with VoiceOver.
   * See https://gerardkcohen.me/writing/2017/voiceover-list-style-type.html
   */
  li::before {
    content: "\\200B"; /* zero-width space */
  }
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
      <CanvasPicker />
      <Links>
        <ul>
          {/* <li><a href="/leaderboard">Leaderboard</a></li> */}
          <li>
            <a href="/">Sign out</a>
          </li>
        </ul>
      </Links>
    </Nav>
  );
}
