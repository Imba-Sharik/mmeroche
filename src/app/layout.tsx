import type { Metadata } from "next";
import { display, ui } from "@/shared/fonts";
import { ThemeProvider, SmoothScroll } from "@/shared/ui";
import { SiteHeader } from "@/widgets/SiteHeader";
import { SiteFooter } from "@/widgets/SiteFooter";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Mmeroche",
    template: "%s — Mmeroche",
  },
  description: "Mmeroche",
  applicationName: "Mmeroche",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Mmeroche",
    title: "Mmeroche",
    description: "Mmeroche",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mmeroche",
    description: "Mmeroche",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${display.variable} ${ui.variable} antialiased overflow-x-clip`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={["light", "dark"]}
        >
          <SmoothScroll />
          {/* Шапка живёт над контентом — страница уезжает под ней */}
          <SiteHeader />
          <div className="relative mx-auto flex min-h-screen w-full max-w-480 flex-col">
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </div>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
