"use client";

import { CircularProgress, css, styled } from "@mui/material";
import {
  Touch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const SCALE_FACTOR = 0.2;
const MAX_ZOOM = 100;
const MIN_ZOOM = 0.5;

const ZOOM_DURATION = 0.1;
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
  const startTouchesRef = useRef<Touch[]>([]);

  const { color } = useSelectedColorContext();
  const { canvas, coords, setCoords } = useCanvasContext();

  const imageUrl = useMemo(
    () => `${config.apiUrl}/api/v1/canvas/${canvas.id}`,
    [canvas.id],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);
  const [velocity, setVelocity] = useState<Point>({ x: 0, y: 0 });
  const [controlledPan, setControlledPan] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(0);

  const handleLoadImage = useCallback((image: HTMLImageElement): void => {
    const initialZoom =
      containerRef.current ? getDefaultZoom(containerRef.current, image) : 1;

    setZoom(initialZoom);
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

      const mousePositionOnCanvas: Point = {
        x: event.offsetX,
        y: event.offsetY,
      };

      // Ensures that the handler can be added to a parent element but only operates on the canvas image wrapper.
      // Applying the handler to lower elements for some isn't consistently picked up in certain browsers (Firefox and Chrome).
      // Ideally, the scrolling should work outside of canvas-image-wrapper, but I can't seem to get the behaviour correct.
      const elem = event.target;
      if (!(elem instanceof HTMLElement)) return;
      if (elem.id !== "canvas-image-wrapper") return;

      // The mouse position's origin is in the top left of the canvas. The offset's origin is the
      // center of the canvas so we do this to convert between the two.
      const mouseOffsetDirection = diffPoints(
        { x: elem.offsetWidth / 2, y: elem.offsetHeight / 2 },
        mousePositionOnCanvas,
      );

      const scale = Math.exp(Math.sign(-event.deltaY) * SCALE_FACTOR);
      const newZoom = clamp(zoom * scale, MIN_ZOOM, MAX_ZOOM);

      // Clamping the zoom means the actual scale may be different.
      const effectiveScale = newZoom / zoom;

      setOffset((prevOffset) => {
        // The direction we need to shift the offset to keep the pixel in the same place
        const offsetDif = diffPoints(mouseOffsetDirection, prevOffset);

        // The amount we shift is scaled based on the amount we've zoomed in.
        const scaledOffsetDiff = multiplyPoint(
          offsetDif,
          // If the scale is 1, we've not zoomed in at all and so this multiplier becomes 0
          // (causing no offset). If the scale is greater than 1, we're zooming in. A larger scale
          // corresponds to a larger step (as 1/effectiveScale approaches 0). If the scale is less
          // than 1, we're zooming out. In this case, 1 / effective scale becomes greater than 1,
          // causing a negative offset. Thanks Henry for figuring out this equation 🙏.
          1 - 1 / effectiveScale,
        );

        return clampOffset(addPoints(scaledOffsetDiff, prevOffset));
      });

      setTransitionDuration(ZOOM_DURATION);
      setZoom(newZoom);
    };

    containerRef.current?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () =>
      containerRef.current?.removeEventListener("wheel", handleWheel);
  }, [zoom]);

  /********************************
   * PANNING FUNCTIONALITY.       *
   ********************************/

  /**
   * Ensure that the offset is within bounds. This is defined as at least half the canvas being on
   * screen along an axis.
   */
  const clampOffset = useCallback(
    (offset: Point): Point => {
      const widthLimit = canvas.width / 2;
      const heightLimit = canvas.height / 2;

      return {
        x: clamp(offset.x, -widthLimit, widthLimit),
        y: clamp(offset.y, -heightLimit, heightLimit),
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
        return clampOffset(newOffset);
      });
    },
    [zoom, clampOffset],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent): void => {
      // Disable transitions while panning
      setTransitionDuration(0);

      const diff = { x: event.movementX, y: event.movementY };
      setVelocity({ x: diff.x, y: diff.y });
      updateOffset(diff);
    },
    [updateOffset],
  );

  /**
   * Remove the listeners when the mouse is released to stop panning.
   */
  const handleMouseUp = useCallback((): void => {
    if (!containerRef.current) return;

    setControlledPan(false);

    containerRef.current.removeEventListener("mousemove", handleMouseMove);
    containerRef.current.removeEventListener("mouseup", handleMouseUp);
    containerRef.current.removeEventListener("mouseleave", handleMouseUp);
  }, [handleMouseMove]);

  /**
   * Only add the mouse move listener when you click down so that moving your mouse normally doesn't
   * cause the canvas to pan.
   */
  const handleStartMousePan = useCallback((): void => {
    if (!containerRef.current) return;

    setControlledPan(true);

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseup", handleMouseUp);
    containerRef.current.addEventListener("mouseleave", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const handleTouchMove = useCallback(
    (event: TouchEvent): void => {
      const touchCount = event.touches.length;
      event.preventDefault();
      setTransitionDuration(0);

      // TODO: Implement multi-touch zooming
      if (touchCount !== 1) return;

      // Check that the touch event is the same as the one that started the pan
      if (event.touches[0].identifier !== startTouchesRef.current[0].identifier)
        return;

      const startTouch = startTouchesRef.current[0];
      const touch = event.touches[0];

      const touchDiff: Point = {
        x: touch.pageX - startTouch.pageX,
        y: touch.pageY - startTouch.pageY,
      };

      setVelocity(touchDiff);

      updateOffset({ x: touchDiff.x, y: touchDiff.y });
      startTouchesRef.current = [touch];
    },
    [updateOffset],
  );

  const handleTouchEnd = useCallback((): void => {
    if (!containerRef.current) return;

    containerRef.current.removeEventListener("touchmove", handleTouchMove);
    containerRef.current.removeEventListener("touchend", handleTouchEnd);
    containerRef.current.removeEventListener("touchcancel", handleTouchEnd);
  }, [handleTouchMove]);

  /**
   * Note: The `React` prefix to `TouchEvent` is necessary to distinguish it from the non-react
   * version used by handleTouchMove.
   */
  const handleStartTouchPan = useCallback(
    (event: React.TouchEvent<HTMLDivElement>): void => {
      if (!containerRef.current) return;

      const touchCount = event.touches.length;

      // TODO: Implement multi-touch zooming
      if (touchCount !== 1) return;

      containerRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      containerRef.current.addEventListener("touchend", handleTouchEnd);
      containerRef.current.addEventListener("touchcancel", handleTouchEnd);
      startTouchesRef.current = Array.from(event.touches);
    },
    [handleTouchMove, handleTouchEnd],
  );

  useEffect(() => {
    const decayVelocity = () => {
      if (velocity.x === 0 && velocity.y === 0) return;
      if (controlledPan) return;
      updateOffset(velocity);
      const decay = 0.75;
      setVelocity((prevVelocity) => ({
        x: prevVelocity.x * decay,
        y: prevVelocity.y * decay,
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
    (event: MouseEvent): void => {
      if (!(event.target instanceof HTMLElement)) return;
      const canvas = event.target;
      const canvasRect = canvas.getBoundingClientRect();

      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const imageX = mouseX / zoom;
      const imageY = mouseY / zoom;

      const boundedX = clamp(Math.floor(imageX), 0, canvas.offsetWidth - 1);
      const boundedY = clamp(Math.floor(imageY), 0, canvas.offsetHeight - 1);
      // we only care about updating the location
      setCoords({
        x: boundedX,
        y: boundedY,
      });
    },
    [zoom, setCoords],
  );

  useEffect(() => {
    canvasImageWrapperRef.current?.addEventListener(
      "mousedown",
      handleCanvasClick,
    );

    return () =>
      canvasImageWrapperRef.current?.removeEventListener(
        "mousedown",
        handleCanvasClick,
      );
  }, [handleCanvasClick]);

  const reticleOffset = calculateReticleOffset(coords);

  return (
    <>
      <CanvasContainer
        ref={containerRef}
        onMouseDown={handleStartMousePan}
        onTouchStart={handleStartTouchPan}
      >
        {config.discordServerInvite && (
          <a href={config.discordServerInvite} target="_blank" rel="noreferrer">
            <InviteButton>Project Blurple</InviteButton>
          </a>
        )}
        <div
          id="canvas-pan-and-zoom"
          ref={canvasPanAndZoomRef}
          style={{
            transform: `matrix(${zoom}, 0, 0, ${zoom}, ${offset.x * zoom}, ${offset.y * zoom})`,
            transition:
              IS_SAFARI ? "" : `transform ${transitionDuration}s ease-out`,
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
