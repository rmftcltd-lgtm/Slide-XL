import type { Metadata } from "next";
import { Unbounded, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Slide XL — The Aussie Pet Mop Built for Real Mess",
    template: "%s · Slide XL",
  },
  description:
    "Pre-Launch Bundle: Slide XL mop, 4 refills & collapsible bucket for $149.95 including shipping across the USA. Invented by Mike the Mop King. Stress-tested by Tamanui.",
  openGraph: {
    title: "Slide XL — Sweep. Mop. Dry. Pet hair done.",
    description:
      "The XL mop pet owners have been waiting for. Pre-Launch Bundle $149.95 shipped free across the USA.",
    images: ["/images/bundle-flatlay.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body
        className={`${display.variable} ${body.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
