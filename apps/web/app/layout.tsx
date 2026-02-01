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
  title: "CogCommit - Document Your AI-Assisted Development",
  description:
    "Track, visualize, and share your cognitive commits. A cognitive commit captures the reasoning, exploration, and decisions that led to the code.",
  keywords: ["AI", "coding", "cognitive commits", "Claude", "development", "documentation"],
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
