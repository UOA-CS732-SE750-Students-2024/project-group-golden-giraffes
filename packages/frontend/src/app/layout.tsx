import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata, Viewport } from "next";

import config from "@/config";
import { QueryClientProvider, SelectedColorProvider } from "@/contexts";
import "@/styles/core.css";
import AuthProvider from "@/contexts/AuthProvider";
import { Theme } from "@/theme";

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  title: "Blurple Canvas",
  description: "Part of Project Blurple",
};

export const viewport: Viewport = {
  themeColor: "#23272a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AuthProvider>
            <QueryClientProvider>
              <SelectedColorProvider>
                <ThemeProvider theme={Theme}>{children}</ThemeProvider>
              </SelectedColorProvider>
            </QueryClientProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
