/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { GlobalProvider } from "@/app/context/GlobalContext";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SessionClientProvider from "@/components/SessionClientProvider";
import { useState } from "react";
import Toast from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <GlobalProvider>
          <SessionClientProvider>
             <Toast message={toast} />
            <Nav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} overflow-scroll`}>
            {children}
            </div>
          </SessionClientProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
