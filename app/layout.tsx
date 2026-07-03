import type { Metadata } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const barlow = Barlow({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://funnel.brikxconsulting.com";

export const metadata: Metadata = {
  title: "brikx — Le Triple Projet pour dirigeants ambitieux",
  description:
    "Une méthode fondée sur les neurosciences pour les dirigeants qui refusent de choisir entre la performance de leur entreprise, leur santé et leur vie.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: "/favicon.jpeg",
    shortcut: "/favicon.jpeg",
  },
  openGraph: {
    title: "brikx — Le Triple Projet",
    description:
      "3 minutes pour découvrir la méthode qui a transformé +200 dirigeants. Réservez votre appel découverte gratuit.",
    url: siteUrl,
    siteName: "brikxconsulting",
    locale: "fr_FR",
    type: "website",
    images: [{ url: `${siteUrl}/logo-brikx.png`, width: 1200, height: 630, alt: "brikx— Le Triple Projet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "brikx — Le Triple Projet",
    description:
      "3 minutes pour découvrir la méthode qui a transformé +200 dirigeants.",
    images: [`${siteUrl}/logo-brikx.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
