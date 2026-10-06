import type { Metadata } from "next";
import { display, ui, accent } from "@/shared/fonts";
import { getSiteUrl, GTM_ID } from "@/shared/config";
import { ThemeProvider, SmoothScroll } from "@/shared/ui";
import { SiteHeader } from "@/widgets/SiteHeader";
import { SiteFooter } from "@/widgets/SiteFooter";
import { ScrollTop } from "@/widgets/ScrollTop";
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
  /**
   * Иконки из `public/`: SVG — во вкладку, PNG 512 — для поисковиков (сниппет
   * Яндекса и Google), домашнего экрана iOS и превью ссылок в мессенджерах.
   */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/snippet.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/snippet.png", sizes: "512x512" },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Mmeroche",
    title: "Mmeroche",
    description: "Mmeroche",
    images: [{ url: "/snippet.png", width: 512, height: 512 }],
  },
  twitter: {
    // Картинка квадратная — большая карточка обрезала бы её
    card: "summary",
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
      <head>
        {/*
          Google Tag Manager — по инструкции GTM: скрипт как можно выше в <head>,
          обычным тегом, а не `next/script`, чтобы стоял в HTML с первого байта.
        */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga -- нужен по инструкции GTM, в <head> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className={`${display.variable} ${ui.variable} ${accent.variable} antialiased`}>
        {/* GTM для браузеров без JS — сразу после открывающего <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
          <ScrollTop />
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
