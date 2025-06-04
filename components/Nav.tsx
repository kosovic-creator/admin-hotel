/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
type NavProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};
export default function Nav({ isSidebarOpen, setIsSidebarOpen }: NavProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="w-full">
      <header className="bg-gradient-to-r from-gray-500 to-gray-900 text-white shadow-lg rounded-b-xl px-6 py-4">
        <nav>
          <div className="flex items-center justify-between">
            {/* Leva strana */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors duration-200 cursor-pointer"
                aria-label="Otvori meni"
              >
                {/* Hamburger ikonica */}
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {/* Ovdje dodaj meni odmah desno od dugmeta */}
              <div
                className={`flex gap-4 transition-all duration-300 ${isSidebarOpen ? "ml-30" : ""
                  }`}
              >
                <Link href="/admin/pregled">Pregled</Link>
                <Link href="/admin/chart">Izvještaji</Link>
              </div>
            </div>
            {/* Desna strana */}
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <HomeIcon className="h-6 w-6 text-white" />
              </Link>
              <span className="text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
                korisnik: {session?.user?.email}
              </span>
            </div>
          </div>
        </nav>
        {/* Sidebar komponenta */}
        {session && (
          <Sidebar
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            session={session}
          />
        )}
      </header>
    </div>
  );
}
