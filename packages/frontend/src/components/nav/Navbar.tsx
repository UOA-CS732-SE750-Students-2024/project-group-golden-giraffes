"use client";

import { useAuthContext } from "@/contexts";
import { IconButton, styled } from "@mui/material";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CanvasPicker } from "../canvas";

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

const Links = styled("ul")`
  display: none;

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: flex;
  }

  li {
    display: inline-flex;
  }

  /*
   * Workaround for accessibility issue with VoiceOver.
   * See https://gerardkcohen.me/writing/2017/voiceover-list-style-type.html
   */
  li::before {
    content: "\\200B"; /* zero-width space */
  }
`;

const MenuButton = styled(IconButton)`
  display: block;

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: none;
  }

  & > svg {
    width: 1.75rem;
    height: 1.75rem;
  }
`;

export default function Navbar() {
  const { user } = useAuthContext();

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
      <MenuButton aria-label="Open menu">
        <MenuIcon />
      </MenuButton>
      <Links>
        <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          {user ?
            <Link href="/me">{user.username}</Link>
          : <Link href="/signin">Sign in</Link>}
        </li>
      </Links>
    </Nav>
  );
}
