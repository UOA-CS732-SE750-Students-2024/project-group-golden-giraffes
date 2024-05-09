"use client";

import { addPoints, tupleToPoint } from "@/components/canvas/point";
import { Point } from "@blurple-canvas-web/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useActiveCanvasContext } from "./ActiveCanvasContext";

interface SelectedPixelPointContextType {
  coords: Point | null;
  adjustedCoords: Point | null;
  setCoords: Dispatch<SetStateAction<Point | null>>;
}

const SelectedPixelLocationContext =
  createContext<SelectedPixelPointContextType>({
    coords: null,
    adjustedCoords: null,
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

  const { canvas } = useActiveCanvasContext();

  return (
    <SelectedPixelLocationContext.Provider
      value={{
        coords: selectedCoords,
        adjustedCoords:
          selectedCoords ?
            addPoints(selectedCoords, tupleToPoint(canvas.startCoordinates))
          : null,
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
