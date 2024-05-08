"use client";

import { styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/button";
import { useActiveCanvasContext, useAuthContext } from "@/contexts";
import { useUserStats } from "@/hooks";
import { useEffect } from "react";

const Container = styled("main")`
  display: flex;
  flex-direction: column;
  padding-block: 2rem;
  place-items: center;
  width: 100%;
  padding: 8rem 4rem;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-inline: 1rem;
  }
`;

const Username = styled("h1")`
  font-stretch: 125%;
  font-weight: 900;
`;

const SignOutButton = styled(Link)`
  /* Otherwise the height of the link doesn't include the button padding */
  display: inline-block;
`;

const StatsCard = styled("div")`
  max-inline-size: 20rem;
  background-color: var(--discord-legacy-not-quite-black);
  padding: 1rem;
`;

const getOrdinalSuffix = (rank: number) => {
  const trailingDigits = rank % 100;
  if (11 <= trailingDigits && trailingDigits <= 13) {
    return "th";
  }
  switch (rank % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export default function MePageContent() {
  const { signOut, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    console.debug("no user");
    return null;
  }
  const { username, profilePictureUrl } = user;
  const { canvas: activeCanvas } = useActiveCanvasContext();

  if (!activeCanvas) {
    console.debug("no active canvas");
    return null;
  }

  const { data: stats, isLoading: statsAreLoading } = useUserStats(
    user.id,
    activeCanvas.id,
  );

  const { totalPixels, rank, mostFrequentColor, mostRecentTimestamp } =
    stats ?? {};

  return (
    <Container>
      <Avatar
        username={username}
        profilePictureUrl={profilePictureUrl}
        size={128}
      />
      <Username>{username}</Username>
      <SignOutButton href="/">
        <Button variant="contained" onClick={signOut}>
          Sign out
        </Button>
      </SignOutButton>
      <StatsCard>
        <h2>{activeCanvas.name}</h2>
        <table>
          <tbody>
            <tr>
              <th>{totalPixels ?? "?"}&nbsp;pixels placed</th>
              <td>
                {statsAreLoading ?
                  "Loading…"
                : rank && `${rank}${getOrdinalSuffix(rank)}`}
              </td>
            </tr>
            <tr>
              <th>Most used color</th>
              <td>
                {statsAreLoading ?
                  "Loading…"
                : mostFrequentColor.name ?? "Unknown"}
              </td>
            </tr>
            <tr>
              <th>Most recently placed</th>
              <td>
                {statsAreLoading ?
                  "Loading…"
                : mostRecentTimestamp ?? "Unknown"}
              </td>
            </tr>
          </tbody>
        </table>
      </StatsCard>
    </Container>
  );
}
