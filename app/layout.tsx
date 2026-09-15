import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 PULSE — Premium Formula 1 Experience",
  description:
    "An immersive 3D Formula 1 experience with interactive telemetry, team showcases, driver analytics, race calendars, and era-spanning timelines. Built with Three.js and React Three Fiber.",
  keywords: ["Formula 1", "F1", "Racing", "Telemetry", "3D", "Three.js"],
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#080a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080a0f] text-white antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
