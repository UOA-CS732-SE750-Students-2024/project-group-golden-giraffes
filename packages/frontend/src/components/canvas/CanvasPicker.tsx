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

  has(:focus),
  has(:focus-visible) {
    outline: var(--focus-outline);
  }
`;

export default function CanvasPicker() {
  const { data: canvases = [] } = useCanvasList();
  const { data: mainCanvas } = useCanvasInfo();

  const allButMain = canvases.filter(({ id }) => id !== mainCanvas?.id);

  return (
    <Select IconComponent={ChevronsUpDown}>
      {mainCanvas && (
        <>
          <option key={mainCanvas.id} value={mainCanvas.id}>
            {mainCanvas.name}
          </option>
          <hr />
        </>
      )}
      {allButMain.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Select>
  );
}
