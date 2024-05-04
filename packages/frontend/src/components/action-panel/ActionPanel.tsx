"use client";

import { styled } from "@mui/material";

const Container = styled("div")`
  border: oklch(100% 0 0 / 15%) solid 3px;
  background-color: var(--color-not-quite-black);
  border-radius: 1.5rem;
  height: 100%;
  width: 100%;
`;

export default function ActionPanel() {
  return <Container />;
}
