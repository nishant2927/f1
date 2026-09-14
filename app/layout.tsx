import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 PULSE — Formula 1 Fandom & History Dashboard",
  description:
    "Immersive F1 fandom application with interactive telemetry, team showcases, driver analytics, race calendars, and era-spanning timelines.",
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
