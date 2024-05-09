"use client";

import { styled } from "@mui/material";

import { ActionPanel } from "@/components/action-panel";
import { CanvasView } from "@/components/canvas";
import config from "@/config";
import { useActiveCanvasContext } from "@/contexts";

const Wrapper = styled("main")`
  body:has(&) {
    --navbar-height: 4rem;

    display: grid;
    grid-template-rows: var(--navbar-height) calc(100vh - var(--navbar-height));
    height: 100vh;
  }

  display: grid;
  gap: 0.5rem 2rem;

  ${({ theme }) => theme.breakpoints.up("md")} {
    --padding-y: 2rem;

    grid-auto-flow: column;
    grid-template-columns: 1fr 23rem;
    padding: var(--padding-y) 4rem;
  }
`;

export default function Main() {
  const { canvas } = useActiveCanvasContext();

  return (
    <Wrapper>
      <CanvasView
        imageUrl={`${config.apiUrl}/api/v1/canvas/${canvas.id}`}
        canvasId={canvas.id}
        isLocked={canvas.isLocked}
      />
      <ActionPanel />
    </Wrapper>
  );
}
