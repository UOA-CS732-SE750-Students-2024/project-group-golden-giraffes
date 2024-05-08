"use client";

import { styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/button";
import { useAuthContext } from "@/contexts";
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

const SignOutButton = styled(Link)`
  /* Otherwise the height of the link doesn't include the button padding */
  display: inline-block;
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

  return (
    <Container>
      <Avatar
        username={username}
        profilePictureUrl={profilePictureUrl}
        size={128}
      />
      <SignOutButton href="/">
        <Button variant="contained" onClick={signOut}>
          Sign out
        </Button>
      </SignOutButton>
    </Container>
  );
}
