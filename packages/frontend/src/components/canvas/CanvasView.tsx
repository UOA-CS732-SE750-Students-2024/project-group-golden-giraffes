"use client";

import { CircularProgress, css, styled } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PlacePixelSocket, Point } from "@blurple-canvas-web/types";

import config from "@/config";
import { useCanvasContext, useSelectedColorContext } from "@/contexts";
import { socket } from "@/socket";
import { clamp } from "@/util";
import { Button } from "../button";
import {
  ORIGIN,
  addPoints,
  diffPoints,
  dividePoint,
  multiplyPoint,
} from "./point";

const CanvasContainer = styled("div")`
  position: relative;
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  border: var(--card-border);
  display: flex;
  grid-row: 1 / -1;
  overflow: hidden;
  place-content: center;
  place-items: center;
  /* Fixes blurry canvas in Safari when canvasImage overlaps with overflow, don't ask why */
  transform: translate3d(0, 0, 0);
  /* Don't handle panning and zooming with browser */
  touch-action: none;

  :active {
    cursor: grabbing;
  }

  &,
  * & {
    user-select: none;
  }

  .loader {
    position: absolute;
  }
`;

const ReticleContainer = styled("div")`
  pointer-events: none;
  position: absolute;
  z-index: 1;
`;

const Reticle = styled("img")`
  image-rendering: pixelated;
`;

const PreviewPixel = styled("div")`
  position: absolute;
`;

const InviteButton = styled(Button)`
  background-color: oklch(var(--discord-legacy-dark-but-not-black-oklch) / 80%);
  border-radius: 0.5rem 0.5rem 1rem 0.5rem;
  bottom: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1.2rem;
  font-variation-settings: "wdth" 125;
  font-weight: 900;
  padding: 0.1rem 1rem;
  position: absolute;
  right: 0.5rem;
  text-decoration: none;
  z-index: 1;

  :hover {
    background-color: var(--discord-blurple);
  }
`;

const CanvasImageWrapper = styled("div")<{ isLoading: boolean }>`
  transition: filter var(--transition-duration-medium) ease;
  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: wait;
      filter: grayscale(80%);
    `}

  position: relative;

  img {
    image-rendering: pixelated;
    pointer-events: none;
  }

  img:not(:first-child) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

/**
 * Calculate the default scale to use for the canvas. This tries to maximise the size of the canvas
 * without it overflowing the screen.
 */
function getDefaultZoom(
  container: HTMLDivElement,
  image: HTMLImageElement,
): number {
  // Don't add any padding on the initial scale for small devices
  const padding = container.clientWidth < 500 ? 0 : 50;

  const scale = Math.min(
    (container.clientWidth - padding) / image.width,
    (container.clientHeight - padding) / image.height,
  );

  return scale;
}

/**
 * Calculate the position of the mouse relative to the given element
 **/
function getRelativeMousePosition(element: HTMLElement, event: MouseEvent) {
  const rect = element.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function calculateTouchOffset(
  pointer1: PointerEvent | undefined,
  pointer2: PointerEvent | undefined,
) {
  if (pointer1 === undefined || pointer2 === undefined) return undefined;
  return {
    x: (pointer1.movementX + pointer2.movementX) / 2,
    y: (pointer1.movementY + pointer2.movementY) / 2,
  };
}

const SCALE_FACTOR = 0.002;
const MAX_ZOOM = 100;
const MIN_ZOOM = 0.9;

const ZOOM_DURATION = 0.1;
const PAN_DECAY = 0.75;
// Transition animation on canvas pan and zoom is blurred on Safari and needs to be disabled.
// If the user spoof their user agent, this is not my problem.
// Bug in question https://bugs.webkit.org/show_bug.cgi?id=27684
const IS_SAFARI =
  navigator.userAgent.includes("Safari/") &&
  !navigator.userAgent.includes("Chrome/") &&
  !navigator.userAgent.includes("Chromium/");

// This is to avoid weird business with the reticle not sizing properly
const RETICLE_ORIGINAL_SCALE = 10;
const RETICLE_ORIGINAL_SIZE = 14;
const RETICLE_SIZE = RETICLE_ORIGINAL_SIZE * 10;
const RETICLE_SCALE = 1 / (RETICLE_ORIGINAL_SCALE * 10);
const PREVIEW_PIXEL_SIZE = 0.8 * RETICLE_ORIGINAL_SCALE * 10;

const pointerEvents: Map<number, PointerEvent> = new Map();
// Used to handle pointer events when there are multiple pointers down
let pointerSyncCounter = 0;

function calculateReticleOffset(coords: Point | null): Point {
  if (!coords) return { x: 0, y: 0 };
  return {
    x: (coords.x - (RETICLE_SIZE - 1) / 2) / RETICLE_SCALE,
    y: (coords.y - (RETICLE_SIZE - 1) / 2) / RETICLE_SCALE,
  };
}

export default function CanvasView() {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasImageWrapperRef = useRef<HTMLImageElement>(null);
  const canvasPanAndZoomRef = useRef<HTMLDivElement>(null);

  const { color } = useSelectedColorContext();
  const { canvas, coords, setCoords } = useCanvasContext();

  const imageUrl = useMemo(
    () => `${config.apiUrl}/api/v1/canvas/${canvas.id}`,
    [canvas.id],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [initialZoom, setInitialZoom] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);
  const [velocity, setVelocity] = useState<Point>({ x: 0, y: 0 });
  const [controlledPan, setControlledPan] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(0);

  const handleLoadImage = useCallback((image: HTMLImageElement): void => {
    const zoom =
      containerRef.current ? getDefaultZoom(containerRef.current, image) : 1;

    setInitialZoom(zoom);
    setZoom(zoom);
    setVelocity(ORIGIN);
    setOffset(ORIGIN);
    setIsLoading(false);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to show the loader when switching canvases
  useEffect(() => {
    setIsLoading(true);
    // The image onLoad doesn't always seem to fire, especially on reloads. Instead, the image
    // seems pre-loaded. This may have something to do with SSR, or browser image caching. We'll
    // need to check it's working correctly when we start placing pixels.
    if (imageRef.current?.complete) {
      handleLoadImage(imageRef.current);
    }
  }, [handleLoadImage, imageUrl]);

  /********************************
   * SOCKET FUNCTIONALITY.       *
   ********************************/

  useEffect(() => {
    const onDisconnect = () => {
      console.debug("[Live Updating]: Disconnected from server");
    };

    // If the canvas is locked, we don't need to listen for updates.
    if (canvas.isLocked) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.debug("[Live Updating]: Connected to server");
      console.debug(
        `[Live Updating]: Listening to pixel updates for canvas ${canvas.id}`,
      );
    };

    const onPixelPlaced = (
      payload: PlacePixelSocket.Payload,
      pixelTimestamp: string,
    ) => {
      console.debug("[Live Updating]: Received pixel update", payload);

      // If we disconnect and reconnect this tells the server we've received pixels up to this point
      socket.auth = {
        ...socket.auth,
        pixelTimestamp,
      };

      // Creates a single pixel png using `OffscreenCanvas` based on the payload,
      // and overlays it over the canvas as a child node.
      const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
      const ctx = offscreenCanvas.getContext("2d");
      if (!ctx) return;
      const [r, g, b, a] = payload.rgba;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      ctx.fillRect(payload.x, payload.y, 1, 1);
      offscreenCanvas.convertToBlob().then((blob) => {
        const pixelImage = new Image();
        pixelImage.src = URL.createObjectURL(blob);
        pixelImage.onload = () => {
          canvasImageWrapperRef.current?.appendChild(pixelImage);
        };
      });
    };

    const pixelPlaceEvent = `place pixel ${canvas.id}`;

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(pixelPlaceEvent, onPixelPlaced);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(pixelPlaceEvent, onPixelPlaced);
      socket.disconnect();
    };
  }, [canvas]);

  /********************************
   * ZOOMING FUNCTIONALITY.       *
   ********************************/

  useEffect(() => {
    /**
     * When we zoom, not only do we need to scale the image, but to give the appearing of zooming
     * in on a specific pixel, we need to offset the image so that the pixel we're zooming in on
     * stays in the same place on the screen after the zoom.
     */
    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault();
      // Ensures that the handler can be added to a parent element but only operates on the canvas image wrapper.
      // Applying the handler to lower elements for some isn't consistently picked up in certain browsers (Firefox and Chrome).
      // Ideally, the scrolling should work outside of canvas-image-wrapper, but I can't seem to get the behaviour correct.
      const elem = event.currentTarget;
      if (!(elem instanceof HTMLElement)) return;
      const mousePositionOnCanvas = getRelativeMousePosition(elem, event);

      // The mouse position's origin is in the top left of the container.
      // Converts this to the offset from the center of the visual container
      const mouseOffset = diffPoints(
        { x: elem.offsetWidth / 2, y: elem.offsetHeight / 2 },
        mousePositionOnCanvas,
      );

      if (event.deltaY === 0) return;
      // Inclusion of deltaY in calculation to account for different polling rate devices
      // Could try logarithmic scale for smoother increments
      const scale = 1 + SCALE_FACTOR * Math.max(Math.abs(event.deltaY), 1);
      const newZoom = event.deltaY > 0 ? zoom / scale : zoom * scale;
      const clampedZoom = clamp(newZoom, MIN_ZOOM * initialZoom, MAX_ZOOM);

      // Clamping the zoom means the actual scale may be different.
      const clampedScale = clampedZoom / zoom;

      setOffset((prevOffset) => {
        // Calculate the of the mouse position relative to the center of the canvas in the container
        const trueOffset = addPoints(prevOffset, mouseOffset);

        // The amount we shift is scaled based on the amount we've zoomed in.
        // Adds an extra shift based on the new scale of the canvas and the true offset
        // Goodbye old comment with old implementation
        const scaledOffsetDiff = multiplyPoint(trueOffset, clampedScale - 1);
        return clampOffset(addPoints(scaledOffsetDiff, prevOffset), newZoom);
      });

      // Use css transition for zoom due to macOS trackpads having high polling rates resulting in laggy zooming if implemented differently
      setTransitionDuration(ZOOM_DURATION);
      setZoom(clampedZoom);
    };

    containerRef.current?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () =>
      containerRef.current?.removeEventListener("wheel", handleWheel);
  }, [initialZoom, zoom]);

  /********************************
   * PANNING FUNCTIONALITY.       *
   ********************************/

  /**
   * Ensure that the offset is within bounds. This is defined as at least half the canvas being on
   * screen along an axis.
   */
  const clampOffset = useCallback(
    (offset: Point, zoom: number): Point => {
      const widthLimit = canvas.width / 2;
      const heightLimit = canvas.height / 2;

      return {
        x: clamp(offset.x, -widthLimit * zoom, widthLimit * zoom),
        y: clamp(offset.y, -heightLimit * zoom, heightLimit * zoom),
      };
    },
    [canvas],
  );

  const updateOffset = useCallback(
    (diff: Point): void => {
      // The more we're zoomed in, the less we've actually moved on the canvas
      const scaledDiff = dividePoint(diff, zoom);

      setOffset((prevOffset) => {
        const newOffset = addPoints(prevOffset, scaledDiff);
        return clampOffset(newOffset, zoom);
      });
    },
    [zoom, clampOffset],
  );

  const handlePan = useCallback(
    (offsetDelta: { x: number; y: number }): void => {
      // Disable transitions while panning
      setTransitionDuration(0);
      const scaledOffset = multiplyPoint(offsetDelta, zoom);
      setVelocity({ x: scaledOffset.x, y: scaledOffset.y });
      updateOffset(scaledOffset);
    },
    [updateOffset, zoom],
  );

  /* A bit heavy handed, but it prevents elements outside of the canvas from being selected during panning */
  const changeGlobalSelectStyle = useCallback((style: "none" | "initial") => {
    document.body.style.userSelect = style;
    // only -webkit-user-select style exists on Safari: https://caniuse.com/mdn-css_properties_user-select
    document.body.style.webkitUserSelect = style;
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const elem = event.currentTarget;
      // Only handle primary pointers to prevent duplicate handling
      if (!(elem instanceof HTMLElement)) return;

      if (pointerEvents.size === 2) {
        pointerSyncCounter++;
        pointerEvents.set(event.pointerId, event as unknown as PointerEvent);
        // Only checks every second pointerEvent to ensure both pointermove events are fired
        if (pointerSyncCounter === 2) {
          const pointerEventValues = pointerEvents.values();
          const offset = calculateTouchOffset(
            pointerEventValues.next().value,
            pointerEventValues.next().value,
          );
          pointerSyncCounter = 0;
          if (!offset) return;
          handlePan(offset);
        }
      } else {
        handlePan({ x: event.movementX, y: event.movementY });
      }
    },
    [handlePan],
  );

  /**
   * Remove the listeners when the mouse is released to stop panning.
   */
  const handlePointerUp = useCallback(
    (event: PointerEvent): void => {
      pointerEvents.delete(event.pointerId);
      const elem = event.currentTarget;
      if (!(elem instanceof HTMLElement)) return;
      elem.releasePointerCapture(event.pointerId);

      // Don't disable handlers if there are still pointers down
      if (pointerEvents.size > 0) return;

      changeGlobalSelectStyle("initial");
      setControlledPan(false);

      elem.removeEventListener("pointermove", handlePointerMove);
      elem.removeEventListener("pointerup", handlePointerUp);
      elem.removeEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, changeGlobalSelectStyle],
  );

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const elem = event.currentTarget;
      elem.setPointerCapture(event.pointerId);
      // Don't store more than 2 pointers for pinch handling
      if (pointerEvents.size < 2) {
        // No idea if this is the right way to define the pointerEvents
        pointerEvents.set(event.pointerId, event as unknown as PointerEvent);
      }

      changeGlobalSelectStyle("none");
      setControlledPan(true);

      elem.addEventListener("pointermove", handlePointerMove);
      elem.addEventListener("pointerup", handlePointerUp);
      elem.addEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp, changeGlobalSelectStyle],
  );

  // Could potentially get replaced by a transition animation with ease, however this will work on Safari
  useEffect(() => {
    const decayVelocity = () => {
      if (velocity.x < 0.1 && velocity.y < 0.1) return;
      if (controlledPan) return;
      updateOffset(velocity);
      setVelocity((prevVelocity) => ({
        x: prevVelocity.x * PAN_DECAY,
        y: prevVelocity.y * PAN_DECAY,
      }));
    };

    const interval = setInterval(decayVelocity, 16); // Run every 16 milliseconds (60 FPS)

    return () => {
      clearInterval(interval);
    };
  }, [velocity, controlledPan, updateOffset]);

  /***********************************
   * SELECTING PIXEL FUNCTIONALITY.  *
   ***********************************/

  /**
   * When the canvas is clicked, we want to know which pixel was clicked on.
   */
  const handleCanvasClick = useCallback(
    (event: PointerEvent): void => {
      if (!(event.currentTarget instanceof HTMLElement) || !event.isPrimary)
        return;
      const canvas = event.currentTarget;
      // Use boundingClientRect for more accurate pixel positioning
      const relativeMousePos = getRelativeMousePosition(canvas, event);
      const canvasPos = dividePoint(relativeMousePos, zoom);

      const boundedCanvasPos = {
        x: clamp(Math.floor(canvasPos.x), 0, canvas.offsetWidth - 1),
        y: clamp(Math.floor(canvasPos.y), 0, canvas.offsetHeight - 1),
      };
      // we only care about updating the location
      setCoords(boundedCanvasPos);
    },
    [zoom, setCoords],
  );

  useEffect(() => {
    canvasImageWrapperRef.current?.addEventListener(
      "pointerdown",
      handleCanvasClick,
    );

    return () =>
      canvasImageWrapperRef.current?.removeEventListener(
        "pointerdown",
        handleCanvasClick,
      );
  }, [handleCanvasClick]);

  const reticleOffset = calculateReticleOffset(coords);

  return (
    <>
      <CanvasContainer ref={containerRef} onPointerDown={handlePointerDown}>
        {config.discordServerInvite && (
          <a href={config.discordServerInvite} target="_blank" rel="noreferrer">
            <InviteButton>Project Blurple</InviteButton>
          </a>
        )}
        <div
          id="canvas-pan-and-zoom"
          ref={canvasPanAndZoomRef}
          style={{
            transform: `matrix(${zoom}, 0, 0, ${zoom}, ${offset.x}, ${offset.y})`,
            transition:
              IS_SAFARI ? undefined : (
                `transform ${transitionDuration}s ease-out`
              ),
          }}
        >
          <ReticleContainer
            style={{
              scale: RETICLE_SCALE,
              ...(coords && {
                transform: `translate(${reticleOffset.x}px, ${reticleOffset.y}px)`,
              }),
            }}
          >
            {color && (
              <PreviewPixel
                style={{
                  width: PREVIEW_PIXEL_SIZE,
                  height: PREVIEW_PIXEL_SIZE,
                  top: (RETICLE_SIZE - PREVIEW_PIXEL_SIZE) / 2,
                  left: (RETICLE_SIZE - PREVIEW_PIXEL_SIZE) / 2,
                  backgroundColor: `rgba(${color?.rgba.join()})`,
                }}
              />
            )}
            <Reticle
              src="./images/reticle.png"
              alt="Reticle"
              className="reticle"
              style={{
                width: RETICLE_SIZE,
                height: RETICLE_SIZE,
                // These min sizes prevent the reticle being squished which causes it to be misalignment.
                minWidth: RETICLE_SIZE,
                minHeight: RETICLE_SIZE,
              }}
            />
          </ReticleContainer>
          <CanvasImageWrapper
            ref={canvasImageWrapperRef}
            isLoading={isLoading}
            id="canvas-image-wrapper"
          >
            <img
              alt="Active Blurple Canvas"
              onLoad={(event) => handleLoadImage(event.currentTarget)}
              ref={imageRef}
              src={imageUrl}
              crossOrigin="anonymous"
            />
          </CanvasImageWrapper>
        </div>
        {isLoading && <CircularProgress className="loader" />}
      </CanvasContainer>
    </>
  );
}
