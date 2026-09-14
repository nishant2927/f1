import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Fandom & History — Cyber Telemetry Dashboard",
  description:
    "An immersive, production-ready F1 fandom application featuring interactive car telemetry, team showcases, driver profiles, and an era timeline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian text-white antialiased grid-bg">
        {children}
      </body>
    </html>
  );
}
