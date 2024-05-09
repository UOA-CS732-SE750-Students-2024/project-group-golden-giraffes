import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import axios from "axios";
import type { Metadata, Viewport } from "next";

import config from "@/config";
import {
  QueryClientProvider,
  SelectedColorProvider,
  SelectedPixelLocationProvider,
} from "@/contexts";
import "@/styles/core.css";
import { ActiveCanvasProvider } from "@/contexts/ActiveCanvasContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Theme } from "@/theme";
import {
  CanvasInfo,
  CanvasInfoRequest,
  DiscordUserProfile,
} from "@blurple-canvas-web/types";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  title: "Blurple Canvas",
  description: "Part of Project Blurple",
};

export const viewport: Viewport = {
  themeColor: "#23272a",
};

/**
 * This specifically needs to be defined in this file so that it doesn't get classified as a server
 * action (requiring it to be async and returning a promise) while still allowing it to access the
 * cookies during SSR... I love Next.js 😭
 */
function getServerSideProfile(): DiscordUserProfile | null {
  const profile = cookies().get("profile");

  if (!profile) {
    return null;
  }

  try {
    return JSON.parse(profile.value);
  } catch {
    return null;
  }
}

async function getServerSideCanvasInfo(): Promise<CanvasInfo> {
  const response = await axios.get<CanvasInfoRequest.ResBody>(
    `${config.apiUrl}/api/v1/canvas/current/info`,
  );
  return response.data;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AuthProvider profile={getServerSideProfile()}>
            <QueryClientProvider>
              <SelectedColorProvider>
                <SelectedPixelLocationProvider>
                  <ActiveCanvasProvider
                    mainCanvasInfo={await getServerSideCanvasInfo()}
                  >
                    <ThemeProvider theme={Theme}>{children}</ThemeProvider>
                  </ActiveCanvasProvider>
                </SelectedPixelLocationProvider>
              </SelectedColorProvider>
            </QueryClientProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
