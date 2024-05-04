"use client";

import { styled } from "@mui/material";

import config from "@/config";
import { ActionPanel, CanvasView } from ".";

const Wrapper = styled("main")`
  body:has(&) {
    display: grid;
    grid-template-rows: auto 1fr;
  }

  display: grid;
  gap: 0.5rem 2rem;

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-auto-flow: column;
    grid-template: 3rem 1fr / 1fr 22rem;
    padding: 2rem 4rem;
  }
`;

export default function Main() {
  return (
    <Wrapper>
      <CanvasView imageUrl={`${config.apiUrl}/api/v1/canvas/current`} />
      <ActionPanel />
    </Wrapper>
  );
}
