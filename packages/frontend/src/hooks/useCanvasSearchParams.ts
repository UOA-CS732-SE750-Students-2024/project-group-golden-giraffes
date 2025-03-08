"use client";

import { diffPoints, multiplyPoint } from "@/components/canvas/point";
import { TABS, useCanvasContext } from "@/contexts/CanvasContext";
import { extractSearchParam } from "@/util";
import { Point } from "@blurple-canvas-web/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCanvasList } from ".";

interface CanvasSearchParams {
  canvasId: number | null;
  x: number | null;
  y: number | null;
  zoom: number | null;
  pixelWidth: number | null;
  pixelHeight: number | null;
}

const emptyCanvasSearchParams: CanvasSearchParams = {
  canvasId: null,
  x: null,
  y: null,
  zoom: null,
  pixelWidth: null,
  pixelHeight: null,
};

export function useCanvasSearchParams(): CanvasSearchParams {
  const searchParams = useSearchParams();

  const canvasId = extractSearchParam(searchParams, ["canvas", "c"]);
  const x = extractSearchParam(searchParams, ["x"]);
  const y = extractSearchParam(searchParams, ["y"]);
  const zoom = extractSearchParam(searchParams, ["z"]);
  const pixelWidth = extractSearchParam(searchParams, ["w"]);
  const pixelHeight = extractSearchParam(searchParams, ["h"]);
  // const frameId = extractSearchParam(searchParams, ["f"]);

  const canvasIdInt = Number.parseInt(canvasId ?? "");
  const xInt = Number.parseInt(x ?? "");
  const yInt = Number.parseInt(y ?? "");
  const zoomNumber = Number.parseInt(zoom ?? "");
  const pixelWidthInt = Number.parseInt(pixelWidth ?? "");
  const pixelHeightInt = Number.parseInt(pixelHeight ?? "");

  const isValidCoords = Number.isInteger(xInt) && Number.isInteger(yInt);
  const isValidZoom = !Number.isNaN(zoomNumber);
  const isValidPixelWidth = !Number.isNaN(pixelWidthInt);
  const isValidPixelHeight = !Number.isNaN(pixelHeightInt);

  if (
    !canvasIdInt ||
    !isValidCoords ||
    isValidZoom === (isValidPixelWidth || isValidPixelHeight)
  ) {
    return emptyCanvasSearchParams;
  }

  return {
    canvasId: canvasIdInt,
    x: isValidCoords ? xInt : null,
    y: isValidCoords ? yInt : null,
    zoom: isValidZoom ? zoomNumber : null,
    pixelWidth: isValidPixelWidth ? pixelWidthInt : null,
    pixelHeight: isValidPixelHeight ? pixelHeightInt : null,
  };
}

export function useCanvasSearchParamsController(
  containerRef: HTMLDivElement | null,
  setMouseOffsetDirection: (offset: Point) => void,
  setTargetZoom: (zoom: number) => void,
) {
  const { canvasId, x, y, zoom, pixelWidth, pixelHeight } =
    useCanvasSearchParams();
  let newZoom = zoom;

  const { data: canvases = [], isLoading: canvasListIsLoading } =
    useCanvasList();
  const { canvas, setCoords, setCanvas, setCurrentTab } = useCanvasContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: If this trigger gets spammed, then coords keep getting set to null
  useEffect(() => {
    if (canvasListIsLoading) {
      return;
    }

    if (canvasId && canvases.some((c) => c.id === canvasId)) {
      setCanvas(canvasId);
    }

    const newCoords = {
      x: Number(x) - canvas.startCoordinates[0],
      y: Number(y) - canvas.startCoordinates[1],
    };

    // has an issue where the new canvas doesn't load fast enough for this to recognise the new canvas boundaries

    if (containerRef && (pixelWidth || pixelHeight)) {
      const potentialZooms: number[] = [];
      if (pixelWidth) {
        potentialZooms.push(containerRef.clientWidth / pixelWidth);
      }
      if (pixelHeight) {
        potentialZooms.push(containerRef.clientHeight / pixelHeight);
      }
      newZoom = Math.min(...potentialZooms);
    }

    if (newZoom) {
      setCurrentTab(TABS.LOOK);

      let newOffset = diffPoints(
        {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        newCoords,
      );
      const modifier = 1 + 1 / newZoom;
      newOffset = multiplyPoint(newOffset, modifier);
      setMouseOffsetDirection(newOffset);
      setTargetZoom(newZoom);
    }
  }, [canvases, canvasListIsLoading, setCoords, setCanvas]);
}
