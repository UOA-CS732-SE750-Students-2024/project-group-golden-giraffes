"use client";

import { CircularProgress, css, styled } from "@mui/material";
import { Touch, useCallback, useEffect, useRef, useState } from "react";

import { PlacePixelSocket, Point } from "@blurple-canvas-web/types";

import { useCanvasContext, useSelectedColorContext } from "@/contexts";
import { Dimensions } from "@/hooks/useScreenDimensions";
import { socket } from "@/socket";
import { clamp } from "@/util";
import updateCanvasPreviewPixel from "./generatePreviewPixel";
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

  canvas {
    image-rendering: pixelated;
    max-width: inherit;
  }
`;

const DisplayCanvas = styled("canvas")<{ isLoading: boolean }>`
  transition: filter var(--transition-duration-medium) ease;
  ${({ isLoading }) =>
    isLoading &&
    css`
      cursor: wait;
      filter: grayscale(80%);
    `}
`;

const PreviewCanvas = styled("canvas")<{ isLoading: boolean }>`
  ${({ isLoading }) =>
    isLoading &&
    css`
      display: none;
    `}
  position: absolute;
  pointer-events: none;
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

export interface CanvasViewProps {
  imageUrl: string;
  canvasId: number;
  isLocked: boolean;
}

export default function CanvasView({
  imageUrl,
  canvasId,
  isLocked,
}: CanvasViewProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const startTouchesRef = useRef<Touch[]>([]);

  const { color } = useSelectedColorContext();
  const { coords, setCoords } = useCanvasContext();

  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imageDimensions, setImageDimension] = useState<Dimensions | null>(
    null,
  );
  const [offset, setOffset] = useState(ORIGIN);
  const [velocity, setVelocity] = useState<Point>({ x: 0, y: 0 });
  const [controlledPan, setControlledPan] = useState(false);
  const [targetZoom, setTargetZoom] = useState(1);
  const [mouseOffsetDirection, setMouseOffsetDirection] = useState(ORIGIN);

  const handleLoadImage = useCallback((image: HTMLImageElement): void => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    // We need to set the width of the canvas first, otherwise if the image is bigger than
    // the canvas it'll get cut off.
    canvasRef.current.width = image.width;
    canvasRef.current.height = image.height;

    context.drawImage(image, 0, 0);

    if (containerRef.current) {
      setZoom(getDefaultZoom(containerRef.current, image));
    } else {
      setZoom(1);
    }

    setOffset(ORIGIN);
    setImageDimension({ width: image.width, height: image.height });
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
    if (isLocked) {
      if (socket.connected) {
        onDisconnect();
        socket.disconnect();
      }
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.debug("[Live Updating]: Connected to server");
      console.debug(
        `[Live Updating]: Listening to pixel updates for canvas ${canvasId}`,
      );
    };

    const onPixelPlaced = (payload: PlacePixelSocket.Payload) => {
      console.debug("[Live Updating]: Received pixel update");

      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      const [r, g, b, a] = payload.rgba;
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      context.fillRect(payload.x, payload.y, 1, 1);
    };

    const pixelPlaceEvent = `place pixel ${canvasId}`;

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(pixelPlaceEvent, onPixelPlaced);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(pixelPlaceEvent, onPixelPlaced);
    };
  }, [canvasId, isLocked]);

  /********************************
   * ZOOMING FUNCTIONALITY.       *
   ********************************/

  useEffect(() => {
    if (!imageDimensions) return;

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

      // The mouse position's origin is in the top left of the canvas. The offset's origin is the
      // center of the canvas so we do this to convert between the two.
      setMouseOffsetDirection(
        diffPoints(
          {
            x: imageDimensions.width / 2,
            y: imageDimensions.height / 2,
          },
          mousePositionOnCanvas,
        ),
      );

      const scale = Math.exp(Math.sign(-event.deltaY) * SCALE_FACTOR);
      const newZoom = clamp(targetZoom * scale, MIN_ZOOM, MAX_ZOOM);

      setTargetZoom(newZoom);
    };

    canvasRef.current?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => canvasRef.current?.removeEventListener("wheel", handleWheel);
  }, [imageDimensions, targetZoom]);

  useEffect(() => {
    if (zoom === targetZoom) return;

    const glideZoom = () => {
      const diff = (targetZoom - zoom) / targetZoom;
      const scale = Math.exp(
        Math.sign(diff) * SCALE_FACTOR * Math.abs(diff) * 2,
      );
      const newZoom = clamp(
        zoom * scale,
        diff > 0 ? MIN_ZOOM : targetZoom,
        diff < 0 ? MAX_ZOOM : targetZoom,
      );

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

      setZoom(newZoom);
    };

    const interval = setInterval(glideZoom, 8);

    return () => clearInterval(interval);
  }, [zoom, targetZoom, mouseOffsetDirection]);

  /********************************
   * PANNING FUNCTIONALITY.       *
   ********************************/

  /**
   * Ensure that the offset is within bounds. This is defined as at least half the canvas being on
   * screen along an axis.
   */
  const clampOffset = useCallback(
    (offset: Point): Point => {
      if (imageDimensions == null) return offset;

      const widthLimit = imageDimensions.width / 2;
      const heightLimit = imageDimensions.height / 2;

      return {
        x: clamp(offset.x, -widthLimit, widthLimit),
        y: clamp(offset.y, -heightLimit, heightLimit),
      };
    },
    [imageDimensions],
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
    if (!canvasRef.current) return;

    canvasRef.current.removeEventListener("touchmove", handleTouchMove);
    canvasRef.current.removeEventListener("touchend", handleTouchEnd);
    canvasRef.current.removeEventListener("touchcancel", handleTouchEnd);
  }, [handleTouchMove]);

  /**
   * Note: The `React` prefix to `TouchEvent` is necessary to distinguish it from the non-react
   * version used by handleTouchMove.
   */
  const handleStartTouchPan = useCallback(
    (event: React.TouchEvent<HTMLDivElement>): void => {
      if (!canvasRef.current) return;

      const touchCount = event.touches.length;

      // TODO: Implement multi-touch zooming
      if (touchCount !== 1) return;

      canvasRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      canvasRef.current.addEventListener("touchend", handleTouchEnd);
      canvasRef.current.addEventListener("touchcancel", handleTouchEnd);
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
      if (!canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const imageX = mouseX / zoom;
      const imageY = mouseY / zoom;

      const boundedX = clamp(
        Math.floor(imageX),
        0,
        canvasRef.current.width - 1,
      );
      const boundedY = clamp(
        Math.floor(imageY),
        0,
        canvasRef.current.height - 1,
      );

      // we only care about updating the location
      setCoords({
        x: boundedX,
        y: boundedY,
      });
    },
    [zoom, setCoords],
  );

  useEffect(() => {
    canvasRef.current?.addEventListener("click", handleCanvasClick);

    return () =>
      canvasRef.current?.removeEventListener("click", handleCanvasClick);
  }, [handleCanvasClick]);

  const handleDrawingSelectedPixel = useCallback(() => {
    if (!imageDimensions || !coords) return;

    updateCanvasPreviewPixel(previewCanvasRef, coords, color);

    console.debug(`Drawing pixel at (${coords.x}, ${coords.y})`);
  }, [imageDimensions, coords, color]);

  useEffect(() => {
    handleDrawingSelectedPixel();
  }, [handleDrawingSelectedPixel]);

  return (
    <>
      <CanvasContainer
        ref={containerRef}
        onMouseDown={handleStartMousePan}
        onTouchStart={handleStartTouchPan}
      >
        <div
          id="canvas-pan-and-zoom"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            scale: zoom,
          }}
        >
          <PreviewCanvas
            isLoading={isLoading}
            ref={previewCanvasRef}
            width={imageDimensions?.width}
            height={imageDimensions?.height}
          />
          <DisplayCanvas ref={canvasRef} isLoading={isLoading} />
        </div>
        {isLoading && <CircularProgress className="loader" />}
      </CanvasContainer>
      <img
        alt="Blurple Canvas 2023"
        hidden
        onLoad={(event) => handleLoadImage(event.currentTarget)}
        ref={imageRef}
        src={imageUrl}
        crossOrigin="anonymous"
      />
    </>
  );
}
