import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Competitor Intelligence & Report Generator",
  description: "Audit competitor YouTube video strategies, analyze upload consistency, engagement rates, and content formats, and generate downloadable client-ready PowerPoint reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#0f172a] text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
