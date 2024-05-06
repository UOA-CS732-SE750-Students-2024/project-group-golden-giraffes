"use client";

import { NativeSelect, styled } from "@mui/material";
import { ChevronsUpDown } from "lucide-react";

import { useCanvasInfo, useCanvasList, useEventInfo } from "@/hooks";

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

  .Mui-disabled {
    cursor: wait;
  }

  :hover:not(.Mui-disabled) {
    background-color: var(--discord-legacy-greyple);
  }

  :hover,
  ::before,
  ::after {
    content: unset;
  }

  :has(:focus),
  :has(:focus-visible) {
    outline: var(--focus-outline);
  }
`;

const canvasToSelectOption = ({ id, name }) => (
  <option key={id} value={id}>
    {name}
  </option>
);

export default function CanvasPicker() {
  const { data: canvases = [], isLoading: canvasListIsLoading } =
    useCanvasList();
  const { data: mainCanvas, isLoading: mainCanvasIsLoading } = useCanvasInfo();
  const { data: currentEvent, isLoading: currentEventIsLoading } =
    useEventInfo();

  const isLoading =
    canvasListIsLoading || mainCanvasIsLoading || currentEventIsLoading;

  const currentCanvases = canvases.filter(
    ({ id }) => id !== mainCanvas?.id && id === currentEvent?.id,
    //          ^~~~~~~~~~~~~~~~~~~~~ main canvas gets its own <optgroup>
  );
  const pastCanvases = canvases.filter(({ id }) => id !== currentEvent?.id);

  return (
    <Select disabled={isLoading} IconComponent={ChevronsUpDown}>
      {mainCanvas && (
        <optgroup label="Main">{canvasToSelectOption(mainCanvas)}</optgroup>
      )}
      {currentCanvases.length > 0 && (
        <optgroup label="Current">
          {currentCanvases.map(canvasToSelectOption)}
        </optgroup>
      )}
      {pastCanvases.length > 0 && (
        <optgroup label="Past">
          {pastCanvases.map(canvasToSelectOption)}
        </optgroup>
      )}
    </Select>
  );
}
