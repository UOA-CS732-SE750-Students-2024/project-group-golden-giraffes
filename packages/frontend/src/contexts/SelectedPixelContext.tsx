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
  coords: Point | null;
  setCoords: Dispatch<SetStateAction<Point | null>>;
}

const SelectedPixelLocationContext =
  createContext<SelectedPixelPointContextType>({
    coords: null,
    setCoords: () => {},
  });

export const SelectedPixelLocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedCoords, setSelectedCoords] = useState<
    SelectedPixelPointContextType["coords"] | null
  >(null);

  return (
    <SelectedPixelLocationContext.Provider
      value={{
        coords: selectedCoords,
        setCoords: setSelectedCoords,
      }}
    >
      {children}
    </SelectedPixelLocationContext.Provider>
  );
};

export const useSelectedPixelContext = () => {
  return useContext(SelectedPixelLocationContext);
};
