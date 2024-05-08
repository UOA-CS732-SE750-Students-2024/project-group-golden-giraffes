"use client";

import { createContext, useContext, useState } from "react";

import { CanvasSummary } from "@blurple-canvas-web/types";

interface ActiveCanvasContextType {
  canvas: CanvasSummary | null;
  setCanvas: (canvas: CanvasSummary) => void;
}

export const ActiveCanvasContext = createContext<ActiveCanvasContextType>({
  canvas: null,
  setCanvas: () => {},
});

export const ActiveCanvasProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeCanvas, setActiveCanvas] =
    useState<ActiveCanvasContextType["canvas"]>(null);

  return (
    <ActiveCanvasContext.Provider
      value={{
        canvas: activeCanvas,
        setCanvas: setActiveCanvas,
      }}
    >
      {children}
    </ActiveCanvasContext.Provider>
  );
};

export const useActiveCanvasContext = () => {
  return useContext(ActiveCanvasContext);
};
