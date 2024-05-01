import { debounce } from "@mui/material";
import { useEffect, useState } from "react";

export interface Dimensions {
  width: number;
  height: number;
}

export function getScreenDimensions(): Dimensions {
  const htmlElement = document.documentElement;

  // This doesn't include the scrollbar width
  return {
    width: htmlElement.clientWidth,
    height: htmlElement.clientHeight,
  };
}

export function useScreenDimensions(): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>(
    getScreenDimensions(),
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      setDimensions(getScreenDimensions());
    }, 350);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}
