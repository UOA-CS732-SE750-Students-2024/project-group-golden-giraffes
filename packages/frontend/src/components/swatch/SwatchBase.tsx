import { css, styled } from "@mui/material";

export const SwatchBase = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorString",
})<{ colorString: string }>(
  ({ colorString }) => css`
    aspect-ratio: 1;
    background-color: ${colorString};
    border-radius: 0.5rem;
  `,
);
