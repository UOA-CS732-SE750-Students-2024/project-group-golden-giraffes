"use client";

import { styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/button";
import { useActiveCanvasContext, useAuthContext } from "@/contexts";
import { useUserStats } from "@/hooks";
import { useEffect } from "react";
import StatsTable from "./StatsTable";

const Container = styled("main")`
  display: flex;
  flex-direction: column;
  padding-block: 2rem;
  place-items: center;
  gap: 1rem;
  width: 100%;
  padding: 8rem 4rem;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-inline: 1rem;
  }
`;

const SignOutButton = styled(Link)`
  /* Otherwise the height of the link doesn't include the button padding */
  display: inline-block;
`;

const StatsCard = styled("div")`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  max-inline-size: 100%;
  min-inline-size: 20rem;
  padding: 1.5rem;
  text-align: center;
`;

export default function MePageContent() {
  const { signOut, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  const { username, profilePictureUrl } = user;
  const { canvas: activeCanvas } = useActiveCanvasContext();

  if (!activeCanvas) return null;
  const { data: stats, isLoading: statsAreLoading } = useUserStats(
    // user.id,
    "204778476102877187",
    activeCanvas.id,
  );

  return (
    <Container>
      <Avatar
        username={username}
        profilePictureUrl={profilePictureUrl}
        size={96}
      />
      <h1>{username}</h1>
      <SignOutButton href="/">
        <Button variant="contained" onClick={signOut}>
          Sign out
        </Button>
      </SignOutButton>
      <StatsCard>
        <h2>{activeCanvas.name}</h2>
        <StatsTable stats={stats} statsAreLoading={statsAreLoading} />
      </StatsCard>
    </Container>
  );
}
