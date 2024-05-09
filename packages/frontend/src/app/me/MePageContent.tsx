"use client";

import { styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/button";
import { useActiveCanvasContext, useAuthContext } from "@/contexts";
import { useUserStats } from "@/hooks";
import { DiscordUserProfile } from "@blurple-canvas-web/types";
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
  margin-block: 1rem;
  max-inline-size: 100%;
  min-inline-size: 20rem;
  padding: 1.5rem;
  text-align: center;
`;

export interface UserStatsPageContentProps {
  userId: string;
  user?: DiscordUserProfile;
  signOut?: () => void;
}

export default function UserStatsPageContent({
  userId,
  user = undefined,
  signOut,
}: UserStatsPageContentProps) {
  const { canvas: activeCanvas } = useActiveCanvasContext();

  let username = user?.username ?? user?.id ?? "Loading...";
  let profilePictureUrl =
    user?.profilePictureUrl ?? "https://cdn.discordapp.com/embed/avatars/1.png";

  const { data: stats, isLoading: statsAreLoading } = useUserStats(
    userId,
    activeCanvas.id,
  );

  if (!activeCanvas) return null;

  if (!user) {
    username = stats?.username ?? stats?.userId ?? "Not found";
    profilePictureUrl =
      stats?.profilePictureUrl ??
      "https://cdn.discordapp.com/embed/avatars/1.png";
  }

  return (
    <Container>
      <Avatar
        username={username}
        profilePictureUrl={profilePictureUrl}
        size={96}
      />
      <h1>{username}</h1>
      {signOut && (
        <SignOutButton href="/">
          <Button variant="contained" onClick={signOut}>
            Sign out
          </Button>
        </SignOutButton>
      )}
      <StatsCard>
        <h2>{activeCanvas.name}</h2>
        <StatsTable
          stats={stats ?? undefined}
          statsAreLoading={statsAreLoading}
        />
      </StatsCard>
    </Container>
  );
}

export function MePageContent() {
  const { signOut, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  return <UserStatsPageContent userId={user?.id ?? ""} signOut={signOut} />;
}
