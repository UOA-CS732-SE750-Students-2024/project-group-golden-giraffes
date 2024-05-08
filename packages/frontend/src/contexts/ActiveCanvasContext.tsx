"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { CanvasInfo } from "@blurple-canvas-web/types";

interface ActiveCanvasContextType {
  canvas: CanvasInfo | null;
  setCanvas: Dispatch<SetStateAction<CanvasInfo | null>>;
}

export const ActiveCanvasContext = createContext<ActiveCanvasContextType>({
  canvas: null,
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
  const [activeCanvas, setActiveCanvas] =
    useState<ActiveCanvasContextType["canvas"]>(mainCanvasInfo);
  console.log(mainCanvasInfo);

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
