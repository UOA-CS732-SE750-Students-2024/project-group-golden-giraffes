"use client";

import { PaletteColor } from "@blurple-canvas-web/types";
import { createContext, useContext, useState } from "react";

interface SelectedColorContextType {
  color: PaletteColor | null;
  setColor: (color: PaletteColor) => void;
}

export const SelectedColorContext = createContext<SelectedColorContextType>({
  color: null,
  setColor: () => {},
});

export const SelectedColorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedColor, setSelectedColor] =
    useState<SelectedColorContextType["color"]>(null);

  return (
    <SelectedColorContext.Provider
      value={{
        color: selectedColor,
        setColor: setSelectedColor,
      }}
    >
      {children}
    </SelectedColorContext.Provider>
  );
};

export const useSelectedColorContext = () => {
  return useContext(SelectedColorContext);
};
