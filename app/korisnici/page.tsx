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
  //   return (
  //     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl pt-20">
  //       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
  //         <div className="mb-4 w-80 relative">
  //           <input
  //             type="text"
  //             value={filter}
  //             onChange={e => {
  //               setFilter(e.target.value);
  //               setCurrentPage(1); // reset to first page on search
  //             }}
  //             placeholder="Pretraži po emailu..."
  //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
  //           />
  //           {filter && (
  //             <button
  //               type="button"
  //               onClick={() => {
  //                 setFilter('');
  //                 setCurrentPage(1);
  //               }}
  //               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
  //               tabIndex={-1}
  //               aria-label="Resetuj pretragu"
  //             >
  //               &#10005;
  //             </button>
  //           )}
  //         </div>
  //         <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lista korisnika</h1>
  //         <div className="flex gap-3 w-full sm:w-auto">
  //           <button
  //             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition cursor-pointer"
  //             onClick={() => {
  //               router.push(`/korisnici/add`);
  //             }}
  //           >
  //             Dodaj
  //           </button>
  //         </div>
  //       </div>
  //       <div className="overflow-x-auto rounded-lg shadow">
  //         <table className="min-w-full bg-white">
  //           <thead>
  //             <tr>
  //               <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">ID</th>
  //               <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Email</th>
  //               <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Rola</th>
  //               <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700"></th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {currentUsers.map((user, idx) => (
  //               <tr key={user.id ?? `user-${idx}`} className="hover:bg-gray-50 transition">
  //                 <td className="py-2 px-4 border-b">{user.id}</td>
  //                 <td className="py-2 px-4 border-b">{user.email}</td>
  //                 <td className="py-2 px-4 border-b">{user.role}</td>
  //                 <td className="py-2 px-4 border-b flex gap-2">
  //                   <button
  //                     className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition cursor-pointer"
  //                     onClick={() => {
  //                       router.push(`/korisnici/${user.id}`);
  //                     }}
  //                   >
  //                     Detalji
  //                   </button>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //       <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
  //         <button
  //           className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold"
  //           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
  //           disabled={currentPage === 1}
  //         >
  //           Prethodna
  //         </button>
  //         {[...Array(totalPages)].map((_, idx) => (
  //           <button
  //             key={idx}
  //             className={`px-4 py-2 rounded font-semibold ${currentPage === idx + 1
  //               ? 'bg-blue-600 text-white'
  //               : 'bg-gray-200 hover:bg-gray-300'}`}
  //             onClick={() => setCurrentPage(idx + 1)}
  //           >
  //             {idx + 1}
  //           </button>
  //         ))}
  //         <button
  //           className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold"
  //           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
  //           disabled={currentPage === totalPages}
  //         >
  //           Sledeća
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl pt-20">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="mb-4 w-80 relative">
          <input
            type="text"
            value={filter}
            onChange={e => {
              setFilter(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            placeholder="Pretraži po emailu..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          {filter && (
            <button
              type="button"
              onClick={() => {
                setFilter('');
                setCurrentPage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
              aria-label="Resetuj pretragu"
            >
              &#10005;
            </button>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lista gostiju</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition cursor-pointer"
            onClick={() => {
              router.push(`/korisnici/add`);
            }}
          >
            Dodaj
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Email</th>
              <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Rola</th>
              <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
          {currentUsers.map((user, idx) => (
            <tr key={user.id ?? `user-${idx}`} className="hover:bg-gray-50 transition">
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b flex gap-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition cursor-pointer"
                  onClick={() => {
                    router.push(`/korisnici/${user.id}`);
                  }}
                >
                  Detalji
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
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
    </div>
  )
}



