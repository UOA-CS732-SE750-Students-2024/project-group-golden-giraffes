"use client";

import { NativeSelect, styled } from "@mui/material";

import { useCanvasInfo, useCanvasList } from "@/hooks";

const Select = styled(NativeSelect)`
  background-color: var(--discord-legacy-not-quite-black);
  border-radius: var(--card-border-radius);
  border: 0;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 500;
  justify-self: flex-start;
  min-inline-size: 16rem;
  padding: 0.5rem 1.25rem;

  :hover {
    background-color: var(--discord-legacy-greyple);
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }
`;

export default function CanvasPicker() {
  const { data: canvases = [] } = useCanvasList();
  const { data: mainCanvas } = useCanvasInfo();

  const allButMain = canvases.filter(({ id }) => id !== mainCanvas?.id);

  return (
    <Select>
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
