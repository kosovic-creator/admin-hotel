//
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import LoadingDots from '@/components/loading-dots';
import { useSession } from "next-auth/react";
import { Users } from '@/types/users';
import { useRouter } from 'next/navigation';
export default function UsersPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    startTransition(() => {
      fetch('/api/auth/korisnici')
        .then(res => res.json())
        .then(setUsers);
    });
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);
  // Filter users by email
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(filter.toLowerCase())
  );
  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white pt-20 rounded-lg  mb-4 gap-4 mt-6 ">
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <Input
            type="search"
            placeholder="Pretraga korisnika..."
            className="pl-10 w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Link href="/korisnici/add" className="w-full md:w-auto">
          <button className="w-full md:w-auto px-4 py-2 rounded-md bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-transform hover:scale-105 cursor-pointer">
            Dodaj korisnika
          </button>
        </Link>
      </div>
      <table className=" bg-white rounded-lg shadow-lg w-full">
        <thead className="bg-gray-300 text-black rounded-t-lg">
          <tr>
            <th className="p-4 text-center font-semibold rounded-tl-lg whitespace-nowrap">Email</th>
            <th className="p-4 text-center font-semibold whitespace-nowrap">Password</th>
            <th className="p-4 text-center font-semibold whitespace-nowrap">Rola</th>
            <th className="p-4 text-center font-semibold rounded-tr-lg whitespace-nowrap">Detalji</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-200">
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8">
                <LoadingDots />
              </td>
            </tr>
          ) : (
            currentUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={`transition ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}
              >
                <td className="p-4 text-center">{user.email}</td>
                <td className="p-4 text-center break-all max-w-xs">
                  {user.password.length > 20 ? user.password.slice(0, 20) + '...' : user.password}
                </td>
                <td className="p-4 text-center">{user.role}</td>
                <td className="p-4 text-center">
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-800 transition-transform hover:scale-105 text-sm font-medium cursor-pointer"
                    onClick={() => {
                      router.push(`/korisnici/${user.id}`);
                    }}
                  >
                    Detalji
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prethodna
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        className={`px-4 py-2 rounded font-semibold ${currentPage === idx + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Sledeća
                </button>
            </div>
      <footer className="flex justify-center items-center p-4 bg-gray-50 mt-10 rounded-b-lg shadow">
        {/* Footer sadržaj po potrebi */}
      </footer>
    </div>
  );
}
