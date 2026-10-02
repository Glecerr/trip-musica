import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trip-musica.vercel.app"),

  title: {
    default: "Trip Music",
    template: "%s | Trip Music",
  },

  description:
    "Noticias, música, eventos, coberturas, fotos y videos de la escena musical.",

  keywords: [
    "Trip Music",
    "música",
    "noticias musicales",
    "recitales",
    "eventos",
    "coberturas",
    "fotografía musical",
    "Argentina",
  ],

  openGraph: {
    title: "Trip Music",
    description:
      "Noticias, música, eventos y coberturas de la escena musical.",
    type: "website",
    locale: "es_AR",
    siteName: "Trip Music",
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
      <body>{children}</body>
    </html>
  );
}