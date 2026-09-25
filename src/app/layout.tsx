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
          {/*
            Без flex: ScrollTrigger пинит секцию через `position: fixed` и
            вставляет распорку в поток. Во flex-контейнере она не резервировала
            высоту, и следующий блок наползал на запиненную «Кухню».
          */}
          {/*
            Обрезка по горизонтали — на всю ширину экрана, а не на колонке
            1920: бордовые свечения — квадраты 376px по центру в долях ширины,
            на телефоне они вылезали за правый край и страница ездила вбок.
            Именно `clip`, а не `hidden`: он не делает обёртку прокручиваемой,
            и пин «Кухни» (`position: fixed`) продолжает работать. По вертикали
            свечения по-прежнему заходят на соседние секции.
          */}
          <div className="overflow-x-clip">
            <div className="relative mx-auto min-h-screen w-full max-w-480">
              {children}
              <SiteFooter />
            </div>
          </div>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
