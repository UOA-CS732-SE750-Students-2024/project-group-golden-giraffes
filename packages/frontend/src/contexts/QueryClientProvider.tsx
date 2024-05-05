"use client";

import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";

const client = new QueryClient();

/**
 * @privateRemarks New versions of NextJS prohibit using providers and contexts
 * directly in a server-rendered component, so this is wrapped in a client
 * component.
 */
export function QueryClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryClientProvider client={client}>
      {children}
    </ReactQueryClientProvider>
  );
}
