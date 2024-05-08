"use client";

import { Point } from "@blurple-canvas-web/types";
import { SetStateAction, createContext, useContext, useState } from "react";

interface SelectedPixelLocationContextType {
  selectedPixelLocation: Point | null;
  setSelectedPixelLocation: React.Dispatch<SetStateAction<Point | null>>;
}

const SelectedPixelLocationContext = createContext<
  SelectedPixelLocationContextType | undefined
>({
  selectedPixelLocation: null,
  setSelectedPixelLocation: () => {},
});

export const SelectedPixelLocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedPixelLocation, setSelectedPixelLocation] =
    useState<Point | null>(null);

  return (
    <SelectedPixelLocationContext.Provider
      value={{ selectedPixelLocation, setSelectedPixelLocation }}
    >
      {children}
    </SelectedPixelLocationContext.Provider>
  );
};

export const useSelectedPixelLocationContext = () => {
  return useContext(SelectedPixelLocationContext);
};
