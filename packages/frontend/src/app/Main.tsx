"use client";

import { styled } from "@mui/material";

import { ActionPanel } from "@/components/action-panel";
import { CanvasView } from "@/components/canvas";

const Wrapper = styled("main")`
  body:has(&) {
    --navbar-height: 4rem;

    display: grid;
    grid-template-rows: var(--navbar-height) calc(100vh - var(--navbar-height));
    height: 100vh;
  }

  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem 2rem;

  ${({ theme }) => theme.breakpoints.up("md")} {
    --padding-y: 2rem;

    grid-auto-flow: column;
    grid-template-columns: 1fr 23rem;
    grid-template-rows: 1fr;
    padding: var(--padding-y) 4rem;
  }
`;

export default function Main() {
  return (
    <Wrapper>
      <CanvasView />
      <ActionPanel />
    </Wrapper>
  );
}
