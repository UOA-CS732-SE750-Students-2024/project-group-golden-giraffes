import { css, styled } from "@mui/material";

import { startsWith$ } from "@/util";

export const SwatchBase = styled("div", {
  shouldForwardProp: startsWith$,
})<{ $colorString: string }>(
  (props) => css`
    aspect-ratio: 1;
    background-color: ${props.$colorString};
    border-radius: 0.5rem;
  `,
);
