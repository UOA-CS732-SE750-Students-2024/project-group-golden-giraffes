"use client";

import { styled } from "@mui/material";

const Container = styled("div")`
  background-color: var(--discord-old-not-quite-black);
  border: var(--card-border);
  border-radius: var(--card-border-radius);
  height: 100%;
  width: 100%;
`;

export default function ActionPanel() {
  return <Container />;
}
