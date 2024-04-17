"use client";
import { createTheme } from "@mui/material";

/*
 * CSS variables are defined in ../styles/core.css
 */

export const Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5865F2", // Blurple
    },
    secondary: {
      main: "#EB459E", // Fuchsia
    },
    success: {
      main: "#57F287", // Green
    },
    error: {
      main: "#ED4245", // Red
    },
    warning: {
      main: "#FEE75C", // Yellow
    },
    info: {
      main: "#5865F2", // Blurple
    },
  },
  typography: {
    fontFamily: "var(--font-sans)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: ".5rem",
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: "0.005em",
          textTransform: "none",
        },
      },
    },
  },
});
