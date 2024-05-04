"use client";

import { styled } from "@mui/material";

const Container = styled("div")`
  background-color: var(--discord-old-not-quite-black);
  border: var(--card-border);
  border-radius: 1.5rem;
  height: 100%;
  width: 100%;
`;

export default function ActionPanel() {
  return <Container />;
}
