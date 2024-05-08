"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { CanvasInfo } from "@blurple-canvas-web/types";

import { useCanvasInfo } from "@/hooks";

interface ActiveCanvasContextType {
  canvas: CanvasInfo | null;
  setCanvas: Dispatch<SetStateAction<CanvasInfo | null>>;
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
  const { data: mainCanvas = null, isLoading: mainCanvasIsLoading } =
    useCanvasInfo();
  const [activeCanvas, setActiveCanvas] =
    useState<ActiveCanvasContextType["canvas"]>(mainCanvas);

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
