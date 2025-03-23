"use client";

import { styled } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const drawerWrapperRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(0);
  // Get value of rem in pixels
  const remPixels = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  // Kinda just eyeballed the 6 rem to be the smallest as it looked ok.
  const pointerBoundaries: CssValue[] = [
    { type: "Rem", value: 6 },
    { type: "Percentage", value: 50 },
    { type: "Percentage", value: 90 },
  ];

  const convertBoundaryToPixels = useCallback(
    (boundary: CssValue, maxHeight: number) => {
      switch (boundary.type) {
        case "Rem":
          return boundary.value * remPixels;
        case "Percentage":
          return (boundary.value * maxHeight) / 100;
      }
    },
    [remPixels],
  );

  // Can't use useMemo since the useEffect to set initial height doesn't fire correctly
  const getMaxHeight = useCallback(() => {
    if (drawerWrapperRef.current?.parentElement) {
      return drawerWrapperRef.current.parentElement.clientHeight;
    }
  }, []);

  // Set the initial height
  useEffect(() => {
    const maxHeight = getMaxHeight();
    if (maxHeight) {
      setDrawerHeight(convertBoundaryToPixels(pointerBoundaries[0], maxHeight));
    }
  }, [getMaxHeight, convertBoundaryToPixels]);

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
        const maxHeight = getMaxHeight();
        if (!maxHeight) return prevHeight;
        // Convert boundary values to pixel values
        const boundaryPixels = pointerBoundaries.map((boundary) =>
          convertBoundaryToPixels(boundary, maxHeight),
        );
        // End loop at one before the last element. Returns the nearest boundary
        for (let i = 0; i < boundaryPixels.length - 1; i++) {
          if (prevHeight < (boundaryPixels[i] + boundaryPixels[i + 1]) / 2) {
            return boundaryPixels[i];
          }
        }
        return boundaryPixels[boundaryPixels.length - 1];
      });

      elem.removeEventListener("pointermove", handlePointerMove);
      elem.removeEventListener("pointerup", handlePointerUp);
      elem.removeEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, getMaxHeight, convertBoundaryToPixels],
  );

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Only handle primary pointers
      if (!event.isPrimary) return;
      // const elemTarget = event.target;

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
      {/* Doing it this way as handlers are directly applied to DrawerWrapper (though it could also be possible to dynamically disable them through code) */}
      <DrawerWrapper
        drawerHeight={drawerHeight}
        style={{ height: `${drawerHeight}px` }}
        ref={drawerWrapperRef}
      >
        {/* Looked at drawers from both Apple and Google, and they both work on the entire drawer instead of just the handle, but the overflow behaviour is a bit weird to get right */}
        <HandleWrapper onPointerDown={handlePointerDown}>
          <Handle />
        </HandleWrapper>
        {children}
      </DrawerWrapper>
      <Wrapper>{children}</Wrapper>
    </>
  );
}
