"use client";

import { Button } from "@/components/Button";
import { useAuthContext } from "@/contexts";
import { Container, styled } from "@mui/material";
import Link from "next/link";

const Wrapper = styled(Container)`
  padding-block: 2rem;
`;

const ButtonLink = styled(Link)`
  /* Otherwise the height of the link doesn't include the button padding */
  display: inline-block;
`;

export default function Main() {
  const { signOut } = useAuthContext();

  return (
    <Wrapper maxWidth="md">
      <ButtonLink href="/">
        <Button variant="contained" onClick={signOut}>
          Sign out
        </Button>
      </ButtonLink>
    </Wrapper>
  );
}
