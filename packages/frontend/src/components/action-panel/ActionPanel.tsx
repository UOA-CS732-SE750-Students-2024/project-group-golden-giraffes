"use client";

import { Point } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { ORIGIN } from "../canvas/point";
import PixelInfoTab from "./PixelInfoTab";
import PlacePixelTab from "./PlacePixelTab";

interface TabContainerProps {
  active: boolean;
}

const TabContainer = styled("div")<TabContainerProps>`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  border: var(--card-border);
  display: ${({ active }) => (active ? "block" : "none")};
  gap: 0.5rem;
  height: 100%;
  padding: 1rem;
  width: 100%;
`;

const TabBar = styled("ul")`
  display: flex;
  gap: 0.25rem;
  list-style-type: none;

  /*
   * Workaround for accessibility issue with VoiceOver.
   * See https://gerardkcohen.me/writing/2017/voiceover-list-style-type.html
   */
  li::before {
    content: "\\200B"; /* zero-width space */
  }
`;

const Tab = styled("li")`
  background-color: var(--discord-legacy-not-quite-black);
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
    background-color: var(--discord-legacy-greyple);
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

export const ActionMenu = styled("div")`
  display: grid;
  gap: max(1rem, 8px);
`;

export const ActionMenuBlock = styled("div")`
  background-color: var(--discord-legacy-dark-but-not-black);
  display: grid;
  gap: max(0.25rem, 2px);
  grid-template-columns: repeat(5, 1fr);
  padding: 0 1rem;
`;

export const Heading = styled("h2")`
  color: oklch(var(--discord-white-oklch) / 60%);
  font-weight: 600;
  font-size: 1rem;
  grid-column: 1 / -1;
  letter-spacing: 0.08em;
  margin-block-start: 1rem;
  text-transform: uppercase;
`;

enum TabTypes {
  Look = "Look",
  Place = "Place",
  Zen = "Zen",
}

export default function ActionPanel() {
  const [currentTab, setCurrentTab] = useState(TabTypes.Place);

  const [coordinates, setCoordinates] = useState(ORIGIN);

  const canvasId = 2023; // This is a placeholder value

  return (
    <>
      <TabBar>
        <Tab onClick={() => setCurrentTab(TabTypes.Look)}>Look</Tab>
        <Tab onClick={() => setCurrentTab(TabTypes.Place)}>Place</Tab>
      </TabBar>

      <TabContainer active={currentTab === TabTypes.Look}>
        <PixelInfoTab coordinates={coordinates} canvasId={canvasId} />
      </TabContainer>
      <TabContainer active={currentTab === TabTypes.Place}>
        <PlacePixelTab />
      </TabContainer>
    </>
  );
}
