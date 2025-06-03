'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rezervacija } from '@/types/rezervacije';
import 'react-datepicker/dist/react-datepicker.css';

const PAGE_SIZE = 10;

export default function Rezervacije() {
  const router = useRouter();
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStart, setFilterStart] = useState<Date | null>(null);
  const [filterEnd, setFilterEnd] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/hotel/rezervacije')
      .then(res => res.json())
      .then(data => setRezervacije(data))
      .catch(err => console.error('Greška pri učitavanju:', err));
  }, []);
  const filteredRezervacije = rezervacije.filter(r => {
    if (!r.soba || !r.gost) return false;
    const pocetak = new Date(r.pocetak);
    const kraj = new Date(r.kraj);
    if (filterStart && pocetak < filterStart && kraj < filterStart) return false;
    if (filterEnd && pocetak > filterEnd && kraj > filterEnd) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredRezervacije.length / PAGE_SIZE);
  const paginatedRezervacije = filteredRezervacije.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Rezervacije</h1>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Filter po datumu:</label>
        <div className="flex gap-4 items-end">
          <input
            type="date"
            value={filterStart ? filterStart.toISOString().split('T')[0] : ''}
            onChange={e => setFilterStart(e.target.value ? new Date(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filterEnd ? filterEnd.toISOString().split('T')[0] : ''}
            onChange={e => setFilterEnd(e.target.value ? new Date(e.target.value) : null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              setFilterStart(null);
              setFilterEnd(null);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium"
          >
            Vrati
          </button>
         <button
              type="button"
              onClick={() => {
                router.push(`/admin/rezervacije/dodaj`);
              }}
              className="px-2 py-2 bg-blue-600 hover:bg-blue-400 rounded-lg text-white font-medium mr-6"
            >
              Dodaj
            </button>
        </div>

      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white w-full">
        <table className="min-w-full w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Broj Sobe</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Gost</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Početak</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kraj</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Broj Noćenja</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ukupno za naplatu</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"></th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedRezervacije.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors border-b last:border-b-0">
                <td className="px-6 py-4 whitespace-nowrap">{r.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.soba.sobaBroj ?? 'Nepoznata soba'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.gost.ime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(r.pocetak).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(r.kraj).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.brojNocenja}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.ukupno}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.gost.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 flex-row-reverse w-full pr-5 text-green-500 hover:text-green-800 transition duration-300">
                    <button
                      className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded-lg font-medium transition cursor-pointer"
                      onClick={() => {
                        router.push(`/admin/rezervacije/${r.id}`);
                      }}
                    >
                      Detalji
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedRezervacije.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">
                  Nema rezervacija za prikaz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prethodna
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Sledeća
        </button>
      </div>
    </div>
  );
}
