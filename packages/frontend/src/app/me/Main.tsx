"use client";

import { Button } from "@/components/Button";
import { useAuthContext } from "@/contexts";
import { Container, styled } from "@mui/material";

const Wrapper = styled(Container)`
  padding-block: 2rem;
`;

export default function Main() {
  const { signOut } = useAuthContext();

  return (
    <Wrapper maxWidth="md">
      <Button variant="contained" onClick={signOut}>
        Sign out
      </Button>
    </Wrapper>
  );
}
