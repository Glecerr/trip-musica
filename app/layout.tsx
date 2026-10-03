import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trip-musica.vercel.app"),
  title: {
    default: "Trip Música",
    template: "%s | Trip Música",
  },
  description:
    "Del escenario a tu pantalla. Noticias, eventos, coberturas, fotos y videos de la escena musical.",
  applicationName: "Trip Música",
  authors: [{ name: "Trip Música" }],
  keywords: [
    "Trip Música",
    "música",
    "recitales",
    "eventos",
    "coberturas",
    "noticias",
    "fotos",
    "videos",
  ],
  openGraph: {
    title: "Trip Música",
    description:
      "Del escenario a tu pantalla. Noticias, eventos y coberturas de la escena musical.",
    url: "https://trip-musica.vercel.app",
    siteName: "Trip Música",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Música",
    description:
      "Del escenario a tu pantalla. Noticias, eventos y coberturas de la escena musical.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f4f2ed] text-[#111] antialiased">
        {children}
      </body>
    </html>
  );
}