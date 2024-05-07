import { styled } from "@mui/material";

export const ButtonSeries = styled("div")`
  display: flex;
  gap: max(0.25rem, 2px);

  > button {
    flex: 1;
  }
`;

interface ButtonProps {
  backgroundColor?: string;
  onClick: () => void;
}

export const Button = styled("button", {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<ButtonProps>`
  align-items: center;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "var(--discord-blurple)"};
  border: oklch(var(--discord-white-oklch) / 12%) 3px solid;
  border-radius: var(--card-border-radius);
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  gap: 0.5rem;
  grid-template-columns: auto 1fr;
  padding: 0.5rem 1rem;
  text-align: center;
  transition:
    background-color var(--transition-duration-medium) ease,
    border-color var(--transition-duration-medium) ease,
    color var(--transition-duration-medium) ease;
  user-select: none;

  > span {
    color: ${({ backgroundColor }) =>
      backgroundColor ? backgroundColor : "var(--discord-blurple)"};
    filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
    mix-blend-mode: luminosity;
    opacity: 0.95;
    // From https://robinrendle.com/the-cascade/015-context-aware-colors/
  }

  &:disabled {
    opacity: 0.6;
  }
`;
