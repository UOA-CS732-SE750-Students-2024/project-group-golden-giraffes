"use client";

import { Container } from "@/components/Container";
import { Button } from "@/components/button/Button";
import { useAuthContext } from "@/contexts";
import { styled } from "@mui/material";
import Link from "next/link";

const ButtonLink = styled(Link)`
  /* Otherwise the height of the link doesn't include the button padding */
  display: inline-block;
`;

export default function Main() {
  const { signOut } = useAuthContext();

  return (
    <Container>
      <ButtonLink href="/">
        <Button variant="contained" onClick={signOut}>
          Sign out
        </Button>
      </ButtonLink>
    </Container>
  );
}
