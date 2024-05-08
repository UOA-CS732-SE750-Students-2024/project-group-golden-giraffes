"use client";

import { css, styled } from "@mui/material";
import { useState } from "react";

import { useActiveCanvasContext } from "@/contexts";
import { PixelInfoTab, PlacePixelTab } from "./tabs";

const Wrapper = styled("div")`
  --padding-width: 1rem;
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  border: var(--card-border);
  display: grid;
  gap: 0.5rem;
  grid-template-rows: auto 1fr;
  padding: var(--padding-width);

  > * {
    border-radius: calc(var(--card-border-radius) - var(--padding-width));
  }
`;

const TabBar = styled("ul")`
  border-radius: .5rem;
  display: grid;
  gap: .5rem;
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

const Tab = styled("li")<{ active?: boolean }>`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: inherit;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.005rem;
  padding: 0.5rem 1rem;
  place-items: center;
  text-align: center;
  touch-action: manipulation;
  transition:
    background-color var(--transition-duration-fast) ease,
    color var(--transition-duration-fast) ease,
    outline var(--transition-duration-fast) ease;
  user-select: none;

  ${({ active }) =>
    active ?
      css`
        background-color: var(--discord-legacy-dark-but-not-black);
      `
    : ""}

  :hover,
  :focus,
  :focus-visible {
    background-color: var(--discord-legacy-dark-but-not-black);
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }

  :active {
    background-color: var(--discord-legacy-greyple);
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
  const { canvas } = useActiveCanvasContext();

  return (
    <Wrapper>
      <TabBar>
        <Tab
          active={currentTab === TABS.PLACE}
          onClick={() => setCurrentTab(TABS.PLACE)}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.key === " ")
              setCurrentTab(TABS.PLACE);
          }}
          tabIndex={0}
        >
          Place
        </Tab>
        <Tab
          active={currentTab === TABS.LOOK}
          onClick={() => setCurrentTab(TABS.LOOK)}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.key === " ")
              setCurrentTab(TABS.LOOK);
          }}
          tabIndex={0}
        >
          Look
        </Tab>
      </TabBar>

      <PlacePixelTab
        active={currentTab === TABS.PLACE}
        eventId={canvas.eventId}
      />
      <PixelInfoTab active={currentTab === TABS.LOOK} canvasId={canvas.id} />
    </Wrapper>
  );
}
