import { PaletteColor } from "@blurple-canvas-web/types";
import { createContext, useState } from "react";

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

  const setColor = (color: PaletteColor) => {
    setSelectedColor(color);
  };

  return (
    <SelectedColorContext.Provider
      value={{
        color: selectedColor,
        setColor,
      }}
    >
      {children}
    </SelectedColorContext.Provider>
  );
};
