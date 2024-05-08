"use client";

import { NativeSelect, nativeSelectClasses, styled } from "@mui/material";
import { ChevronsUpDown } from "lucide-react";

import { useActiveCanvasContext } from "@/contexts";
import { useCanvasInfo, useCanvasList, useEventInfo } from "@/hooks";
import { CanvasSummary } from "@blurple-canvas-web/types";

const Select = styled(NativeSelect)`
  background-color: var(--discord-legacy-not-quite-black);
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: inherit;
  font-weight: 500;
  justify-self: flex-start;
  min-inline-size: 16rem;

  &,
  & * {
    user-select: none;
  }

  .${nativeSelectClasses.select} {
    padding: 0.25rem 1rem;

    :focus,
    :focus-visible {
      background-color: unset;
      outline: 0;
    }
  }

  .${nativeSelectClasses.icon} {
    color: oklch(var(--discord-white-oklch) / 45%);
    margin-inline: 0.25rem;
  }

  .${nativeSelectClasses.disabled} {
    cursor: wait;
  }

  :hover:not(.${nativeSelectClasses.disabled}) {
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

const canvasToSelectOption = ({ id, name }: CanvasSummary) => (
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
  const { canvas: activeCanvas, setCanvas } = useActiveCanvasContext();
  console.log(activeCanvas);

  const isLoading =
    canvasListIsLoading || mainCanvasIsLoading || currentEventIsLoading;

  const currentCanvases = canvases.filter(
    ({ id, eventId }) => id !== mainCanvas?.id && eventId === currentEvent?.id,
    //                   ^~~~~~~~~~~~~~~~~~~~~ main canvas gets its own <optgroup>
  );
  const pastCanvases = canvases.filter(({ id }) => id !== currentEvent?.id);

  function handleChangeCanvas(event: React.ChangeEvent<HTMLSelectElement>) {
    setCanvas(Number.parseInt(event.target.value));
  }

  return (
    <Select
      disabled={isLoading}
      IconComponent={ChevronsUpDown}
      onChange={handleChangeCanvas}
      value={activeCanvas?.id || ""}
    >
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
