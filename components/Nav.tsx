'use client';
import React from 'react'
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import Sidebar from './Sidebar';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
type NavProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

export default function Nav({ isSidebarOpen, setIsSidebarOpen }: NavProps) {
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
    <div className="w-full">
      <header className="bg-gradient-to-r from-gray-500 to-gray-900 text-white shadow-lg rounded-b-xl px-6 py-4">

        <nav>
          <div className="flex items-center justify-between">
            {/* Leva strana */}
            <div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                aria-label="Otvori meni"
              >
                {/* Hamburger ikonica */}
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Desna strana */}

            <div className="flex items-center gap-4">
              <Link href="/admin">
              <HomeIcon className="h-6 w-6 text-white" />
              </Link>
              <span className="text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
                korisnik: {session.user?.email}
              </span>
            </div>
          </div>
        </nav>
        {/* Sidebar komponenta */}
        <Sidebar
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          session={session}
        />
      </header>
    </div>
  );
}
