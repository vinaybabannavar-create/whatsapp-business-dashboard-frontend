"use client";

import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Dark mode MUST run only on client – no Zustand here anymore
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig
        value={{
          fetcher: (url: string) => fetch(url).then((res) => res.json()),
        }}
      >
        {children}
        <Toaster richColors position="top-right" />
      </SWRConfig>
    </QueryClientProvider>
  );
}
