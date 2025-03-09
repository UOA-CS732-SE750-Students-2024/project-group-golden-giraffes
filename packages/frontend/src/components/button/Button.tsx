import { Button as MuiButton, styled } from "@mui/material";

export const Button = styled(MuiButton)`
  border: oklch(from var(--discord-white) l c h / 12%) 3px solid;
  transition: var(--transition-duration-fast) ease;
  transition-property: background-color, border-color, color;
`;
