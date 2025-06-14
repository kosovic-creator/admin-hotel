'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import { Gost } from '@/types/gosti';

export default function GostiLista() {
    const [gost, setGost] = useState<Gost[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        async function učitajGosta() {
            try {
                const response = await fetch('/api/hotel/gosti');
                if (!response.ok) {
                    throw new Error('grešk sa serverom');
                }
                const data = await response.json();
                setGost(data);
            } catch (error) {
                setError(error as Error);
            }
        }
        učitajGosta();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const filtriraniGosti = (gost ?? []).filter(g =>
        (g.ime + ' ' + g.prezime).toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtriraniGosti.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const trenutniGost = filtriraniGosti.slice(startIdx, startIdx + itemsPerPage);

    return (
        <div className=" max-w-3xl mx-auto mt-24 p-8   ">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="mb-4 w-80 relative">
                    <input
                        type="text"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // resetuj na prvu stranicu kad se pretražuje
                        }}
                        placeholder="Pretraži po imenu ili prezimenu..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
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
                            router.push(`/admin/gosti/dodaj`);
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
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Ime</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Prezime</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Email</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trenutniGost.map((item, idx) => (
                            <tr key={item.id ?? `gost-${idx}`} className="hover:bg-gray-50 transition">
                                <td className="py-2 px-4 border-b">{item.id}</td>
                                <td className="py-2 px-4 border-b">{item.ime}</td>
                                <td className="py-2 px-4 border-b">{item.prezime}</td>
                                <td className="py-2 px-4 border-b">{item.email}</td>
                                <td className="py-2 px-4 border-b flex gap-2">
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition cursor-pointer"
                                        onClick={() => {
                                            router.push(`/admin/gosti/${item.id}`);
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
