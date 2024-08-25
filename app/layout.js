import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ספקי שירות מומלצים בקהילה",
  description: "מצאו ספקי שירות מומלצים בקהילה שלכם",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>{children}<Analytics /></body>
    </html>
  );
}