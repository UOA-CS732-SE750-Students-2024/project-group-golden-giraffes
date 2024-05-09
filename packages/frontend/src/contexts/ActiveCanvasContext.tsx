"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

import config from "@/config";
import { socket } from "@/socket";
import { CanvasInfo, CanvasInfoRequest } from "@blurple-canvas-web/types";
import { useSelectedColorContext, useSelectedPixelLocationContext } from ".";

interface ActiveCanvasContextType {
  canvas: CanvasInfo;
  setCanvas: (canvasId: CanvasInfo["id"]) => void;
}

export const ActiveCanvasContext = createContext<ActiveCanvasContextType>({
  canvas: {
    id: -1,
    name: "",
    width: 0,
    height: 0,
    startCoordinates: [0, 0],
    isLocked: false,
    eventId: null,
    webPlacingEnabled: false,
  },
  setCanvas: () => {},
});

interface ActiveCanvasProviderProps {
  children: React.ReactNode;
  mainCanvasInfo: CanvasInfo;
}

export const ActiveCanvasProvider = ({
  children,
  mainCanvasInfo,
}: ActiveCanvasProviderProps) => {
  const [activeCanvas, setActiveCanvas] = useState(mainCanvasInfo);
  const { setCoords } = useSelectedPixelLocationContext();
  const { setColor: setSelectedColor } = useSelectedColorContext();

  const setCanvasById = useCallback<ActiveCanvasContextType["setCanvas"]>(
    async (canvasId: CanvasInfo["id"]) => {
      const response = await axios.get<CanvasInfoRequest.ResBody>(
        `${config.apiUrl}/api/v1/canvas/${canvasId}/info`,
      );

      setActiveCanvas(response.data);
      setSelectedColor(null);
      setCoords(null);

      // When we load an image, we want to make sure any pixels placed since now get included in the
      // response. This is because in the time it takes for the image to load some pixels may have
      // already been placed.
      socket.auth = {
        canvasId,
        pixelTimestamp: new Date().toISOString(),
      };
    },
    [setSelectedColor, setCoords],
  );

  return (
    <ActiveCanvasContext.Provider
      value={{
        canvas: activeCanvas,
        setCanvas: setCanvasById,
      }}
    >
      {children}
    </ActiveCanvasContext.Provider>
  );
};

export const useActiveCanvasContext = () => {
  return useContext(ActiveCanvasContext);
};
