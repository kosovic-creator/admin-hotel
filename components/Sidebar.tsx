'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { redirect } from "next/navigation"; // Import useRouter from next/navigation
import { Session } from "next-auth"; // Import Session type
export type SidebarProps = {
    session: Session;
    open: boolean;
    onClose: () => void;
};
const Sidebar: React.FC<SidebarProps> = ({ session, open, onClose }) => {
    const [isVisible, setIsVisible] = useState(open);
    // Redirect to sign-in if no session
    useEffect(() => {
        if (!session) {
            redirect("/login");
        }
    }, [session]);
    // Close sidebar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar && !sidebar.contains(event.target as Node)) {
                setIsVisible(false);
                onClose(); // Call onClose prop when closing
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);
    // Update local state when open prop changes
    useEffect(() => {
        setIsVisible(open);
    }, [open]);
    // Automatsko zatvaranje sidebara na timer
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 3000); // 3000ms = 3 sekunde
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);
    return (
        <>
            <aside
                id="sidebar"
                className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-500 via-gray-900 to-gray-950 text-white w-40 p-6 shadow-2xl rounded-r-2xl border-r-2 border-gray-700 transform ${isVisible ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out flex flex-col`}
            >
                <div className="flex flex-col gap-6 pt-8 items-start mt-16">
                    <Link
                        href="/admin/pregled-slobodnih-soba"
                        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 hover:underline transition-colors"
                    >
                        Rezerviši
                    </Link>
                    <Link
                        href="/admin/rezervacije"
                        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 hover:underline transition-colors"
                    >
                        Pregled
                    </Link>
                    <Link
                        href="/admin/sobe"
                        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 hover:underline transition-colors"
                    >
                        Sobe
                    </Link>
                    <Link
                        href="/admin/sobe/tip_sobe"
                        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 hover:underline transition-colors"
                    >
                        Tip Sobe
                    </Link>
                    <Link
                        href="/admin/gosti"
                        className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 hover:underline transition-colors"
                    >
                        Gosti
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                        <Link
                            href="/korisnici"
                            className="w-full px-4 py-2 rounded-lg hover:bg-gray-700 hover:underline transition-colors"
                        >
                            Korisnici
                        </Link>
                    )}
                    <div className="mt-16 w-full">
                        {session ? (
                            <SignOut />
                        ) : (
                            <Link
                                href="/login"
                                className="block w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-center font-bold transition-colors"
                            >
                                Prijavi se
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
export default Sidebar;