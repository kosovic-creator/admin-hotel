/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toast from '@/components/ui/Toast';
import { Sobe } from '@/types/sobe';
import { Gost } from '@/types/gosti';
import { Rezervacija } from '@/types/rezervacije';
import { rezervacijaSchema } from '@/types/zod/rezervacijeSchema';

function DodajRezrvaciju() {
  const searchParams = useSearchParams();
  const sobaIdParam = searchParams.get('sobaId');
  const pocetakParam = searchParams.get('pocetak');
  const krajParam = searchParams.get('kraj');

  const [selectedSobaId, setSelectedSobaId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ime, setIme] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);
  const [sobe, setSobe] = useState<Sobe[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [zauzetiTermini, setZauzetiTermini] = useState<{ start: string; end: string }[]>([]);
  const router = useRouter();

  // Učitaj sve sobe
  useEffect(() => {
    fetch('/api/hotel/sobe')
      .then(res => res.json())
      .then(setSobe);
  }, []);

  // Inicijalizuj iz query parametara (ako postoje)
  useEffect(() => {
    if (sobaIdParam) setSelectedSobaId(Number(sobaIdParam));
    if (pocetakParam) setStartDate(new Date(pocetakParam));
    if (krajParam) setEndDate(new Date(krajParam));
  }, [sobaIdParam, pocetakParam, krajParam]);

  // Učitaj zauzete termine za izabranu sobu
  useEffect(() => {
    if (!selectedSobaId) {
      setZauzetiTermini([]);
      return;
    }
    fetch(`/api/hotel/rezervacije/zauzeti/${selectedSobaId}`)
      .then(res => res.json())
      .then(setZauzetiTermini);
  }, [selectedSobaId]);

  const excludeIntervals = zauzetiTermini.map(t => ({
    start: new Date(t.start),
    end: new Date(t.end),
  }));

  const isValidRange = startDate && endDate && startDate < endDate;

  async function novaRezervacija(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const data = {
      sobaId: selectedSobaId ? Number(selectedSobaId) : undefined,
      pocetak: startDate ? startDate.toISOString() : undefined,
      kraj: endDate ? endDate.toISOString() : undefined,
      ime,
      email,
    };
    const result = rezervacijaSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch(`/api/hotel/rezervacije`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        setToast('Greška u dodavanju nove rezervacije.');
        throw new Error('Greška kod servera');
      }
      setStartDate(null);
      setEndDate(null);
      setIme('');
      setEmail('');
      setToast('Uspješno dodata nova rezervacija.');
      setTimeout(() => router.push('/admin/rezervacije'), 2000);
    } catch (error) {
      setToast('Greška u dodavanju nove rezervacije.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <p className="text-3xl font-bold text-center text-black-700 mb-2">Nova Rezervacija</p>
        <form onSubmit={novaRezervacija} className="space-y-4">
          {/* Izbor sobe */}
          <div>
            <select
              value={selectedSobaId ?? ''}
              onChange={e => setSelectedSobaId(e.target.value ? Number(e.target.value) : null)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Izaberi sobu</option>
              {sobe.map(s => (
                <option key={s.id} value={s.id}>{s.opis || `Soba ${s.id}`}</option>
              ))}
            </select>
            {errors.sobaId && <p className="text-red-500 text-xs mt-1">{errors.sobaId}</p>}
          </div>
          {/* DatePickers prikazuj samo ako je izabrana soba */}
          {selectedSobaId && (
            <>
              <div className="flex flex-col gap-1 font-medium text-gray-700">
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date as Date | null)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="yyyy-MM-dd'T'HH:mm"
                  excludeDateIntervals={excludeIntervals}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  placeholderText="Početak rezervacije"
                  minDate={new Date()}
                />
                {errors.pocetak && <p className="text-red-500 text-xs mt-1">{errors.pocetak}</p>}
              </div>
              <div className="flex flex-col gap-1 font-medium text-gray-700">
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date as Date | null)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="yyyy-MM-dd'T'HH:mm"
                  excludeDateIntervals={excludeIntervals}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  placeholderText="Kraj rezervacije"
                  minDate={startDate || new Date()}
                />
                {errors.kraj && <p className="text-red-500 text-xs mt-1">{errors.kraj}</p>}
              </div>
            </>
          )}
          <div>
            <input
              type="text"
              value={ime}
              onChange={e => setIme(e.target.value)}
              placeholder="Ime gosta"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            {errors.ime && <p className="text-red-500 text-xs mt-1">{errors.ime}</p>}
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email gosta"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-medium transition"
              onClick={() => router.push(`/admin/rezervacije`)}
            >
              Odloži
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white font-semibold py-2 rounded hover:bg-gray-700 transition"
              disabled={
                !selectedSobaId ||
                !startDate ||
                !endDate ||
                !isValidRange
              }
            >
              Dodaj
            </button>
          </div>
          {startDate && endDate && !isValidRange && (
            <p className="text-red-500 text-xs mt-1">
              Početak mora biti prije kraja!
            </p>
          )}
        </form>
      </div>
      <Toast message={toast} />
    </div>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <DodajRezrvaciju />
    </Suspense>
  );
}
