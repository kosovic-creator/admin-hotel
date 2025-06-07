/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import Link from 'next/link';
import { Sobe } from '@/types/sobe'
import { Rezervacija } from '@/types/rezervacije';

export default function PregledSlobodnihSoba() {
  const [soba, setSobe] = useState<Sobe[]>([])
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Dodaj state za sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Možeš promijeniti broj po želji

  useEffect(() => {
    const ucitajSobe = async () => {
      try {
        const response = await fetch('/api/hotel/sobe')
        if (!response.ok) throw new Error('Greška pri učitavanju soba')
        const data = await response.json()
        setSobe(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepoznata greška')
      }
    }
    const ucitajRezervacije = async () => {
      try {
        const response = await fetch('/api/hotel/rezervacije')
        if (!response.ok) throw new Error('Greška pri učitavanju rezervacija')
        const data = await response.json()
        setRezervacije(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepoznata greška rezervacija')
      }
    }
    Promise.all([ucitajSobe(), ucitajRezervacije()]).finally(() => setLoading(false))
  }, [])
  if (error) return <div className="text-red-500 p-4">Greška: {error}</div>
  const isSobaDostupana = (sobaId: number) => {
    if (!startDate || !endDate) return true;

    return !rezervacije.some(r =>
      r.soba.id === sobaId &&
      new Date(r.pocetak) < endDate &&
      new Date(r.kraj) > startDate
    );
  };

  // Filtriraj dostupne soba
  const dostupneSobe = soba.filter(soba => isSobaDostupana(soba.id));
  const totalPages = Math.ceil(dostupneSobe.length / itemsPerPage);

  // Sobe za prikaz na trenutnoj stranici
  const paginatedSobe = dostupneSobe.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} pt-24`}>
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 ">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">Pregled slobodnih soba</h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md">
            <DatePicker
              className="border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Unesite početni datum"
            />
            <DatePicker
              className="border-2 border-blue-300 rounded-lg px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Unesite završni datum"
            />
        </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
              <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Broj Sobe</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Naziv</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Opis</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cijena (€)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slike</th>
                  <th className="px-6 py-4"></th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSobe.map(soba => (
                  <tr key={soba.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{soba.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{soba.sobaBroj}</td>
                    <td className="px-6 py-4 max-w-xs text-gray-600">{soba.tipSobe.ime}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{soba.opis}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">{soba.tipSobe.cijena}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                        {soba.slike.slice(0, 3).map((slika, index) => (
                        <Image
                          key={index}
                          src={slika}
                          alt={`Slika ${index + 1}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-cover rounded-lg border border-gray-200 shadow"
                        />
                      ))}
                        {soba.slike.length > 3 && (
                          <span className="text-gray-500 text-xs self-center">+{soba.slike.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                        className={`bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold ${(!startDate || !endDate) ? 'opacity-50 pointer-events-none' : ''}`}
                        href={`/admin/pregled-slobodnih-soba/dodaj?sobaId=${soba.id}${startDate ? `&pocetak=${startDate.toISOString().split('T')[0]}` : ''}${endDate ? `&kraj=${endDate.toISOString().split('T')[0]}` : ''}`}
                      >
                        Dodaj
                      </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* PAGINACIJA */}
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
          {soba.length === 0 && !loading && (
            <div className="text-center text-gray-500 mt-8">Nema dostupnih soba.</div>
        )}
      </div>
    </div>
    </>
  )
}
