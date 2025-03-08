"use client";

import { useAuthContext } from "@/contexts";
import { IconButton, Link, styled } from "@mui/material";
import { MenuIcon } from "lucide-react";

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

export default function NavLinks() {
  const { user } = useAuthContext();

  return (
    <>
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
    </>
  );
}
