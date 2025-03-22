"use client";

import { styled } from "@mui/material";
import { useCallback } from "react";

const Wrapper = styled("div")`
  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;

const DrawerWrapper = styled("div")`
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
    height: 50%;
    display: flex;
    flex-direction: column;
    gap: 0;
    bottom: 0;
  }
  & > * {
    flex-grow: 1;
  }
`;

const HandleWrapper = styled("div")`
  cursor: grab;
  padding-block: 0.4rem 0;
  padding-inline: auto;
  display: flex;
  place-content: center;
  flex-grow: 0;
`;

const Handle = styled("div")`
  background-color: var(--discord-white);
  border-radius: 0.2rem;
  width: 4rem;
  height: 0.4rem;
`;

interface SlideableDrawerProps {
  children: React.ReactNode;
}

export default function SlideableDrawer({ children }: SlideableDrawerProps) {
  /**
   * Defaults to pan when a single pointer is down, and zoom when two pointers are down.
   */
  const handlePointerMove = useCallback((event: PointerEvent): void => {
    const elem = event.currentTarget;
    // Only handle primary pointers to prevent duplicate handling
    if (!(elem instanceof HTMLElement)) return;
    console.log(event.movementX);
  }, []);

  /**
   * Remove the listeners when the mouse is released to stop panning.
   */
  const handlePointerUp = useCallback(
    (event: PointerEvent): void => {
      const elem = event.currentTarget;
      if (!(elem instanceof HTMLElement)) return;
      elem.releasePointerCapture(event.pointerId);

      elem.removeEventListener("pointermove", handlePointerMove);
      elem.removeEventListener("pointerup", handlePointerUp);
      elem.removeEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove],
  );

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
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
      <DrawerWrapper onPointerDown={handlePointerDown}>
        <HandleWrapper>
          <Handle />
        </HandleWrapper>
        {children}
      </DrawerWrapper>
      <Wrapper>{children}</Wrapper>
    </>
  );
}
