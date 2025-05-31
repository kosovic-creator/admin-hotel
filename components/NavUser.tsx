'use client';
import React from 'react'
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import SidebarUser from './SidebarUser';
type NavProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

export default function NavUser({ isSidebarOpen, setIsSidebarOpen }: NavProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      console.log("Redirecting to login page");
    }
  }, [status, router]);
  if (status === "loading" || !session) {
    return null;
  }
  console.log("Session data:", session.user?.role);
  return (
    <div className="min-h-[64px]">
      <header className="bg-blue-800 text-white shadow-lg rounded-b-xl px-6 py-4">
        <nav>
          <div className="flex items-center justify-between">
            {/* Leva strana: Hamburger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Otvori meni"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Desna strana: Info o korisniku */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow">
              <span className="text-xs text-white">Korisnik:</span>
              <span className="text-sm font-semibold text-white">{session.user?.email}</span>
            </div>
          </div>
        </nav>
        {/* Sidebar komponenta */}
        <SidebarUser open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} session={session} />
      </header>
    </div>
  );
}
