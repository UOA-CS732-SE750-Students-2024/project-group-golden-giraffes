"use client";

import { styled } from "@mui/material";

const Container = styled("div")`
  background-color: var(--discord-old-not-quite-black);
  border: var(--card-border);
  border-radius: var(--card-border-radius);
  height: 100%;
  width: 100%;
`;

const TabBar = styled("ul")`
  display: flex;
  gap: 0.25rem;
  list-style-type: none;
`;

const Tab = styled("li")`
  background-color: var(--discord-old-not-quite-black);
  border-radius: var(--card-border-radius);
  cursor: pointer;
  display: block flex;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0.5rem 1.25rem;
  place-items: center;
  touch-action: manipulation;
  transition:
    background-color var(--transition-duration-fast) ease,
    color var(--transition-duration-fast) ease,
    outline var(--transition-duration-fast) ease;
  user-select: none;

  :hover {
    background-color: var(--discord-old-greyple);
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }

  :active {
    background-color: var(--discord-yellow);
    color: var(--discord-black);
  }
`;

const ZenTab = styled(Tab)`
  margin-inline-start: auto;
`;

export default function ActionPanel() {
  return (
    <>
      <TabBar>
        <Tab>Look</Tab>
        <Tab>Place</Tab>
        <ZenTab>🧘</ZenTab>
      </TabBar>
      <Container />
    </>
  );
}
