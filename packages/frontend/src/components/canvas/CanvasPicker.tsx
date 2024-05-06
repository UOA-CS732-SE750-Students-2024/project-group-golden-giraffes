"use client";

import { NativeSelect, styled } from "@mui/material";
import { ChevronsUpDown } from "lucide-react";

import { useCanvasInfo, useCanvasList } from "@/hooks";

const Select = styled(NativeSelect)`
  background-color: var(--discord-legacy-not-quite-black);
  border: 0;
  border-radius: var(--card-border-radius);
  cursor: pointer;
  font-size: inherit;
  font-weight: 500;
  justify-self: flex-start;
  min-inline-size: 16rem;
  padding: 0.25rem 1rem;

  &,
  & * {
    user-select: none;
  }

  :hover,
  ::before,
  ::after {
    content: unset;
  }

  .MuiNativeSelect-select {
    padding: 0;

    :focus,
    :focus-visible {
      background-color: unset;
      outline: 0;
    }
  }

  .MuiNativeSelect-icon {
    color: oklch(var(--discord-white-oklch) / 45%);
    margin-inline: 0.25rem;
  }

  :hover {
    background-color: var(--discord-legacy-greyple);
  }

  :has(:focus),
  :has(:focus-visible) {
    outline: var(--focus-outline);
  }
`;

export default function CanvasPicker() {
  const { data: canvases = [], isLoading: canvasListIsLoading } =
    useCanvasList();
  const { data: mainCanvasInfo, isLoading: mainCanvasInfoIsLoading } =
    useCanvasInfo();
  const isLoading = canvasListIsLoading || mainCanvasInfoIsLoading;

  const allButMain = canvases.filter(({ id }) => id !== mainCanvasInfo?.id);

  return (
    <Select disabled={isLoading} IconComponent={ChevronsUpDown}>
      {mainCanvasInfo && (
        <optgroup label="Main canvas">
          <option key={mainCanvasInfo.id} value={mainCanvasInfo.id}>
            {mainCanvasInfo.name}
          </option>
          <hr />
        </optgroup>
      )}
      <optgroup label="Other canvases">
        {allButMain.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </optgroup>
    </Select>
  );
}
