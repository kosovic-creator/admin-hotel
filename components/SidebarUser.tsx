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

const SidebarUser: React.FC<SidebarProps> = ({ session, open, onClose }) => {
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
                className={`fixed top-0 left-0 h-full bg-blue-900 text-white w-64 p-6 shadow-lg transform ${isVisible ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out flex flex-col z-50`}
            >
                <div className="flex flex-col gap-6 pt-8 items-start mt-10">
                    <Link
                        href="/pregled-slobodnih-apartmana"
                        className="w-full px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        <span className="font-semibold text-lg">Rezervacija</span>
                    </Link>
                    <Link
                        href="/admin/soba"
                        className="w-full px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        <span className="font-semibold text-lg">Sobe</span>
                    </Link>
                    <Link
                        href="/admin/rezervacije"
                        className="w-full px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        <span className="font-semibold text-lg">Rezervacije</span>
                    </Link>
                    <Link
                        href="/admin/gosti"
                        className="w-full px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        <span className="font-semibold text-lg">Gosti</span>
                    </Link>
                    <div className="mt-10 w-full">
                        {session ? (
                            <div className="w-full">
                                <SignOut />
                            </div>
                        ) : (
                                <Link
                                    href="/login"
                                    className="block w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-center font-semibold transition-colors"
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

export default SidebarUser;