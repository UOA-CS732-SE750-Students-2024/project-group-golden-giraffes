"use client";

import { Button as MuiButton, styled } from "@mui/material";

export const Button = styled(MuiButton)`
  border: oklch(var(--discord-white-oklch) / 12%) 3px solid;
  transition:
    background-color var(--transition-duration-fast) ease,
    border-color var(--transition-duration-fast) ease,
    color var(--transition-duration-fast) ease;
`;
