"use client";

import { Point } from "@blurple-canvas-web/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface SelectedPixelPointContextType {
  pixelPoint: Point | null;
  setPixelPoint: Dispatch<SetStateAction<Point | null>>;
}

const SelectedPixelLocationContext =
  createContext<SelectedPixelPointContextType>({
    pixelPoint: null,
    setPixelPoint: () => {},
  });

export const SelectedPixelLocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPixelPoint, setSelectedPixelPoint] = useState<
    SelectedPixelPointContextType["pixelPoint"] | null
  >(null);

  return (
    <SelectedPixelLocationContext.Provider
      value={{
        pixelPoint: selectedPixelPoint,
        setPixelPoint: setSelectedPixelPoint,
      }}
    >
      {children}
    </SelectedPixelLocationContext.Provider>
  );
};

export const useSelectedPixelLocationContext = () => {
  return useContext(SelectedPixelLocationContext);
};
