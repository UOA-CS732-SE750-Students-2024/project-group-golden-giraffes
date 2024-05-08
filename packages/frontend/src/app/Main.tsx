"use client";

import { styled } from "@mui/material";

import config from "@/config";
import { ActionPanel } from "../components/action-panel";
import { CanvasView } from "../components/canvas";

const Wrapper = styled("main")`
  body:has(&) {
    display: grid;
    grid-template-rows: auto 1fr;
  }

  display: grid;
  gap: 0.5rem 2rem;

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: 1fr 23rem;
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
