"use client";

import { styled } from "@mui/material";
import { useState } from "react";

import { PixelInfoTab, PlacePixelTab } from "./tabs";

interface TabContainerProps {
  active: boolean;
}

const Wrapper = styled("div")`
  display: block flex;
  flex-direction: column;
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  border: var(--card-border);
  gap: 1rem;
  padding: 1rem;
`;

const TabBar = styled("ul")`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  list-style-type: none;



    /*
     * Workaround for accessibility issue with VoiceOver.
     * See https://gerardkcohen.me/writing/2017/voiceover-list-style-type.html
     */
    li::before {
      content: "\\200B"; /* zero-width space */
    }
  }
`;

const Tab = styled("li")`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: inherit;
  cursor: pointer;
  display: block flex;
  font-weight: 500;
  letter-spacing: 0.005rem;
  padding: 0.5rem 1rem;
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

export const Heading = styled("h2")`
  color: oklch(var(--discord-white-oklch) / 60%);
  font-weight: 600;
  font-size: 1rem;
  grid-column: 1 / -1;
  letter-spacing: 0.08em;
  margin-block: 2rem 0.5rem;
  text-transform: uppercase;
`;

const TABS = {
  LOOK: "Look",
  PLACE: "Place",
};

export default function ActionPanel() {
  const [currentTab, setCurrentTab] = useState(TABS.PLACE);

  const canvasId = 2023; // This is a placeholder value

  return (
    <Wrapper>
      <TabBar>
        <Tab onClick={() => setCurrentTab(TABS.LOOK)}>Look</Tab>
        <Tab onClick={() => setCurrentTab(TABS.PLACE)}>Place</Tab>
      </TabBar>

      <PixelInfoTab active={currentTab === TABS.LOOK} canvasId={canvasId} />
      <PlacePixelTab active={currentTab === TABS.PLACE} />
    </Wrapper>
  );
}
