import type { Metadata } from "next";
import { Source_Serif_4, Fira_Code } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tuhnr - Track Your AI Coding",
  description:
    "The free, fun way to track your AI coding. Build streaks, hit goals, and see your progress over time.",
  keywords: ["AI", "coding", "tracking", "Claude", "Cursor", "streaks", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSerif.variable} ${firaCode.variable} font-serif bg-bg text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
