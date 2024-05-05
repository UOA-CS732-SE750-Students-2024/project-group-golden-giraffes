"use client";
import { PaletteColor } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import React, { ReactNode } from "react";

const ColorContainer = styled("div")`
  display: flex;
  align-items: center;
`;
const ColorBox = styled("div")<{ rgba: number[] }>(
  ({ rgba }) => `
    background-color: rgba(${rgba.toString()});
    width: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 15%;
  `,
);
export const Color = ({ color }: { color: PaletteColor }): ReactNode => {
  return (
    <ColorContainer>
      <ColorBox rgba={color.rgba} />
      {color.name}
    </ColorContainer>
  );
};
