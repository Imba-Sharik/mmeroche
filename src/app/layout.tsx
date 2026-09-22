import type { Metadata } from "next";
import { display, note, ui, accent } from "@/shared/fonts";
import { getSiteUrl } from "@/shared/config";
import { ThemeProvider, SmoothScroll } from "@/shared/ui";
import { SiteHeader } from "@/widgets/SiteHeader";
import { SiteFooter } from "@/widgets/SiteFooter";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
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
      <body className={`${display.variable} ${note.variable} ${ui.variable} ${accent.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
