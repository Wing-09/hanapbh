import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NextAuthSessionProvider from "@/components/page/auth/NextAuthSessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Hanap BH",
  description:
    "A website utilizing google maps api to locate your nearby boadring houses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          // "grid grid-rows-[auto_1fr] w-screen h-dvh overflow-x-hidden",
          "antialiased",
          manrope.className
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthSessionProvider>
            {children}
            <Toaster />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
