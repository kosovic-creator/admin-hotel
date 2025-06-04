'use client';
import React, { useEffect, useState } from 'react';
import { Rezervacija } from '@/types/rezervacije';
import 'react-datepicker/dist/react-datepicker.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PAGE_SIZE = 10;

export default function ChartPregled() {

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
  function getMonthlyTotals(rezervacije: Rezervacija[]) {
    const totals: { [key: string]: number } = {};
    rezervacije.forEach(r => {
      const date = new Date(r.pocetak);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      totals[month] = (totals[month] || 0) + (typeof r.ukupno === 'number' ? r.ukupno : 0);
    });
    // Pretvori u niz za chart
    return Object.entries(totals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, ukupno]) => ({ month, ukupno }));
  }
  function getMonthlyTotalsByRoom(rezervacije: Rezervacija[]) {
    const totals: { [month: string]: { [room: string]: number } } = {};
    rezervacije.forEach(r => {
      const date = new Date(r.pocetak);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const room = r.soba?.sobaBroj || 'Nepoznata';
      if (!totals[month]) totals[month] = {};
      totals[month][room] = (totals[month][room] || 0) + (typeof r.ukupno === 'number' ? r.ukupno : 0);
    });
    // Pretvori u niz za chart
    return Object.entries(totals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, rooms]) => ({ month, ...rooms }));
  }
  const monthlyTotals = getMonthlyTotals(filteredRezervacije);
  const monthlyTotalsByRoom = getMonthlyTotalsByRoom(filteredRezervacije);
  const allRooms = Array.from(
    new Set(filteredRezervacije.map(r => r.soba?.sobaBroj || 'Nepoznata'))
  );

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Pregled</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ukupno naplaćeno po mesecima</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTotals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ukupno" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ukupno naplaćeno po mesecima i sobama</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyTotalsByRoom}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {allRooms.map(room => (
              <Bar
                key={room}
                dataKey={room}
                stackId="a"
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                name={`Soba ${room}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
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
              {/* <th className="px-6 py-3"></th> */}
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
                {/* <td className="px-6 py-4 whitespace-nowrap">
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
                </td> */}
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
      <div className="flex justify-end mt-4 mb-2">
        <span className="text-lg font-semibold text-gray-700">
          Ukupno za naplatu:{" "}
          {filteredRezervacije.reduce((sum, r) => sum + (typeof r.ukupno === "number" ? r.ukupno : 0), 0)}
        </span>
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
