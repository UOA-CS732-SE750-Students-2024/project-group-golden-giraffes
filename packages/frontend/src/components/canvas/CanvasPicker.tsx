"use client";

import { styled } from "@mui/material";

import { useCanvases } from "@/hooks";

const Select = styled("select")`
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
  const { data: canvases } = useCanvases();

  return (
    <Select>
      {canvases.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Select>
  );
}
