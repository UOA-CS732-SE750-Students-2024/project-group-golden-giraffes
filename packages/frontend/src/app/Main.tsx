"use client";

import { styled } from "@mui/material";

import config from "@/config";
import { ActionPanel, CanvasView } from "../components";

const Wrapper = styled("main")`
  body:has(&) {
    --navbar-height: 4rem;

    display: grid;
    grid-template-rows: var(--navbar-height) 1fr;
    height: 100vh;
  }

  display: grid;
  gap: 0.5rem 2rem;

  ${({ theme }) => theme.breakpoints.up("md")} {
    --padding-y: 2rem;

    grid-auto-flow: column;
    grid-template-rows: 3rem calc(
        100vh - var(--navbar-height) - 4 * var(--padding-y)
      );
    grid-template-columns: 1fr 23rem;
    padding: var(--padding-y) 4rem;
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
