import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nitaigroup.com"),
  title: {
    default: "NITAI AI Skill Academy | Learn AI, Earn While You Learn",
    template: "%s | NITAI AI Skill Academy",
  },
  description:
    "India's leading AI learning & earning platform. 12 flagship courses, 12X value system, WAIO certification. Join 10,000+ learners building AI careers.",
  keywords: [
    "AI courses",
    "artificial intelligence training",
    "AI certification",
    "learn AI",
    "AI career",
    "WAIO certification",
    "prompt engineering",
    "AI automation",
    "AI freelancing",
    "AI entrepreneurship",
  ],
  authors: [{ name: "NITAI AI & Digital Empire Ecosystem" }],
  creator: "NITAI AI Skill Academy",
  publisher: "NITAI AI & Digital Empire Ecosystem",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nitaigroup.com",
    siteName: "NITAI AI Skill Academy",
    title: "NITAI AI Skill Academy | Learn AI, Earn While You Learn",
    description:
      "India's leading AI learning & earning platform. 12 flagship courses, 12X value system, WAIO certification.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NITAI AI Skill Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NITAI AI Skill Academy",
    description: "Learn AI, Earn While You Learn - India's leading AI platform",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-slate-950 text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}