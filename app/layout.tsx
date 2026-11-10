import type { Metadata } from "next";
import "./globals.css";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Shugli",
  description: "Your go-to for jobs",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans min-h-full flex flex-col bg-background  text-foreground `}
      >
        {children}
      </body>
    </html>
  );
}
