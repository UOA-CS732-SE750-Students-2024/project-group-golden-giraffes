"use client";

import { styled } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const Wrapper = styled("div")`
  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;

const DrawerWrapper = styled("div")<{ drawerHeight: number }>`
  ${({ theme }) => theme.breakpoints.up("md")} {
    display: none;
  }

  /* Styling for action panel in drawer mode */
  ${({ theme }) => theme.breakpoints.down("md")} {
    border-radius: var(--card-border-radius);
    border: var(--card-border);
    background-color: var(--discord-legacy-not-quite-black);

    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
    bottom: 0;
    transition: height 0.5s ease;
    &:active {
      transition: none;
    }
  }
  & > * {
    flex-grow: 1;
    /* Only applied to the top level elements that aren't scrollable */
    /* I can envision a more hacky way to apply it to all children if desired*/
    touch-action: none;
  }
`;

const HandleWrapper = styled("div")`
  cursor: grab;
  padding-block: 0.8rem 0;
  padding-inline: auto;
  display: flex;
  place-content: center;
  /* Hacky, overwrites the flex-grow from DrawerWrapper */
  flex-grow: 0 !important;
`;

const Handle = styled("div")`
  background-color: var(--discord-white);
  border-radius: 0.2rem;
  width: 4rem;
  height: 0.4rem;
`;

type CssValue =
  | { type: "Rem"; value: number }
  | { type: "Percentage"; value: number };

interface SlideableDrawerProps {
  children: React.ReactNode;
}

export default function SlideableDrawer({ children }: SlideableDrawerProps) {
  const [maxHeight, setMaxHeight] = useState(0);
  const drawerWrapperRef = useCallback((elem: HTMLDivElement | null) => {
    if (!elem || !elem.parentElement) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0].target.clientHeight;
      setMaxHeight(height);
    });
    resizeObserver.observe(elem.parentElement);
  }, []);

  const [drawerHeight, setDrawerHeight] = useState(0);
  // Get value of rem in pixels
  const remPixels = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  // Kinda just eyeballed the 6 and 3.75 rem and it looked ok.
  const pointerBounds: CssValue[] = [
    { type: "Rem", value: 6 },
    { type: "Percentage", value: 50 },
    { type: "Rem", value: -3.75 },
  ];

  const convertBoundToPixels = useCallback(
    (maxHeight: number) => {
      return pointerBounds.map((bound) => {
        switch (bound.type) {
          case "Rem":
            if (bound.value < 0) {
              return maxHeight + bound.value * remPixels;
            }
            return bound.value * remPixels;
          case "Percentage":
            return (bound.value * maxHeight) / 100;
        }
      });
    },
    [remPixels],
  );

  const snapToBounds = useCallback(
    (height: number) => {
      // Convert boundary values to pixel values
      const boundsPixels = convertBoundToPixels(maxHeight);
      // End loop at one before the last element. Returns the nearest boundary
      for (let i = 0; i < boundsPixels.length - 1; i++) {
        if (height < (boundsPixels[i] + boundsPixels[i + 1]) / 2) {
          return boundsPixels[i];
        }
      }
      return boundsPixels[boundsPixels.length - 1];
    },
    [maxHeight, convertBoundToPixels],
  );

  // Set the initial height
  useEffect(() => {
    setDrawerHeight((prevHeight) => snapToBounds(prevHeight));
  }, [snapToBounds]);

  /**
   * Defaults to pan when a single pointer is down, and zoom when two pointers are down.
   */
  const handlePointerMove = useCallback((event: PointerEvent): void => {
    // Shouldn't occur, but don't handle non-primary pointers
    if (!event.isPrimary) return;
    setDrawerHeight((prevHeight) => prevHeight - event.movementY);
  }, []);

  /**
   * Remove the listeners when the mouse is released to stop panning.
   */
  const handlePointerUp = useCallback(
    (event: PointerEvent): void => {
      const elem = event.currentTarget;
      if (!(elem instanceof HTMLElement)) return;
      elem.releasePointerCapture(event.pointerId);

      setDrawerHeight((prevHeight) => {
        return snapToBounds(prevHeight);
      });

      elem.removeEventListener("pointermove", handlePointerMove);
      elem.removeEventListener("pointerup", handlePointerUp);
      elem.removeEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, snapToBounds],
  );

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Only handle primary pointers
      if (!event.isPrimary) return;
      const currentTarget = event.currentTarget;
      let elemTarget: EventTarget | null = event.target;
      if (!(currentTarget instanceof HTMLElement)) {
        return;
      }
      // Loop through all parents of the target until until current target to find if target is scrollable
      while (currentTarget !== elemTarget) {
        if (!(elemTarget instanceof HTMLElement)) return;
        // If target is scrollable past an arbitrary threshold, then don't resize drawer
        if (elemTarget.scrollHeight - elemTarget.clientHeight > 5) {
          return;
        }
        elemTarget = elemTarget.parentElement;
      }

      const elem = event.currentTarget;
      elem.setPointerCapture(event.pointerId);
      elem.addEventListener("pointermove", handlePointerMove);
      elem.addEventListener("pointerup", handlePointerUp);
      elem.addEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp],
  );

  return (
    <>
      {/* Duplicating DrawerWrapper and Wrapper as handlers are directly applied to DrawerWrapper (though it could also be possible to dynamically disable them through code) */}
      <DrawerWrapper
        drawerHeight={drawerHeight}
        style={{ height: `${drawerHeight}px` }}
        ref={drawerWrapperRef}
        onPointerDown={handlePointerDown}
      >
        <HandleWrapper>
          <Handle />
        </HandleWrapper>
        {children}
      </DrawerWrapper>
      <Wrapper>{children}</Wrapper>
    </>
  );
}
