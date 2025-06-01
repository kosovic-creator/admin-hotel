'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { Sobe } from '@/types/sobe';

export default function SobeLista() {
    const [soba, setSoba] = useState<Sobe[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        async function učitajSobu() {
            try {
                const response = await fetch('/api/hotel/sobe');
                if (!response.ok) {
                    throw new Error('greška sa serverom');
                }
                const data = await response.json();
                setSoba(data);
            } catch (error) {
                setError(error as Error);
            }
        }
        učitajSobu();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    // Pagination logic
    const totalPages = Math.ceil((soba ? soba.length : 0) / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const trenutnaSoba = (soba ?? []).slice(startIdx, startIdx + itemsPerPage);

    return (
        <div className="w-full mt-12 p-8 bg-white rounded-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lista soba</h1>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition cursor-pointer"
                        onClick={() => {
                            router.push(`/admin/sobe/dodaj`);
                        }}
                    >
                        Dodaj sobu
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">ID</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Broj</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Tip</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Opis</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Kapacitet</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Cijena</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Status</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Slike</th>
                            <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trenutnaSoba.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="py-2 px-4 border-b">{item.id}</td>
                                <td className="py-2 px-4 border-b">{item.sobaBroj}</td>
                                <td className="py-2 px-4 border-b">{item.tipSobe.ime}</td>
                                <td className="py-2 px-4 border-b">{item.opis}</td>
                                <td className="py-2 px-4 border-b">{item.tipSobe.kapacitet}</td>
                                <td className="py-2 px-4 border-b">{item.tipSobe.cijena}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded text-xs font-medium
                    ${item.status === 'spremna' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex gap-2">
                                        {item.slike && item.slike.slice(0, 3).map((slika, idx) => (
                                            <Image
                                                key={idx}
                                                src={slika}
                                                alt={`Slika ${item.tipSobe.ime} ${idx + 1}`}
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 object-cover rounded border border-gray-200 shadow"
                                            />
                                        ))}
                                        {item.slike && item.slike.length > 3 && (
                                            <span className="text-gray-500 self-center">+{item.slike.length - 3}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b flex gap-2">
                                    <button

                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition cursor-pointer"
                                        onClick={() => {
                                            router.push(`/admin/sobe/${item.id}`);
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
        </div>
    )
}
