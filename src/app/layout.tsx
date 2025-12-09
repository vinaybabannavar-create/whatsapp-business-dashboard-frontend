import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AppShell from "./AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Business Dashboard",
  description: "Migrated from vanilla JS → Next.js 14 with modern best practices",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode') === 'true';
                  if (darkMode) 
                    document.documentElement.classList.add('dark');
                  else 
                    document.documentElement.classList.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body
  style={{ background: "var(--bg)", color: "var(--text)" }}
  className={`${inter.className} min-h-screen w-full transition-colors duration-300`}
>
  <AppShell>{children}</AppShell>
</body>

    </html>
  );
}
